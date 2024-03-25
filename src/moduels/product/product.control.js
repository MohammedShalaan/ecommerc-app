import slugify from "slugify"

import Brand from "../../../db/models/brand.model.js"
import Product from "../../../db/models/product.model.js"
import { SystemRole } from "../../utils/system.role.js"
// import cloudinaryConnection from "../../utils/cloudinary.js"
import cloudinaryConnection from "../../utils/cloudinary.connection.utils.js"
import { UniqueString, UniqueCharOTP } from "unique-string-generator"
import userModel from "../../../db/models/user.model.js"
import SubCategoryModel from "../../../db/models/subcategory.model.js"
import categoryModel from "../../../db/models/category.model.js"
import { paginationFunction } from "../../utils/pagination.js"
import { APIFeatures } from "../../utils/api-features.js"
// import generateUniqueString from "../../utils/generate-Unique-String.js"


/**
 * 
 * @param {*} req body: {title, desc, basePrice, discount, stock, specs}  authUser
 * @param {*} req query: {categoryId, subCategoryId, brandId}
 * @param {*} req authUser :{_id}
 * @returns the created product data with status 201 and success message
 * @description add a product to the database
 */


//================================= Add product API =================================//
export const addProduct = async (req, res, next) => {
    // data from the request body
    const { title, desc, basePrice, discount, stock, specs } = req.body
    // data from the request query
    const { categoryId, subCategoryId, brandId } = req.query
    // data from the request authUser
    const addedBy = req.autherith


    const userdata = await userModel.findById(addedBy)

    // brand check 
    const brand = await Brand.findById(brandId)
    if (!brand) return next({ cause: 404, message: 'Brand not found' })

    // category check
    if (brand.categoryId.toString() !== categoryId) return next({ cause: 400, message: 'Brand not found in this category' })
    // sub-category check
    if (brand.subCategoryId.toString() !== subCategoryId) return next({ cause: 400, message: 'Brand not found in this sub-category' })

    // who will be authorized to add a product
    if (
        userdata.role !== SystemRole.superAdmin &&
        brand.addedBy.toString() !== addedBy.toString()
    ) return next({ cause: 403, message: 'You are not authorized to add a product to this brand' })

    // generate the product  slug
    const slug = slugify(title, { lower: true, replacement: '-' })  //  lowercase: true

    //  applied price calculations
    const appliedPrice = basePrice - (basePrice * (discount || 0) / 100)

    console.log(specs)

    //Images
    if (!req.files?.length) return next({ cause: 400, message: 'Images are required' })
    const Images = []
    const folderId = UniqueCharOTP(9)
    const folderPath = brand.Image.public_id.split(`${brand.folderId}/`)[0]

    for (const file of req.files) {
        // ecommerce-project/Categories/4aa3/SubCategories/fhgf/Brands/5asf/z2wgc418otdljbetyotn
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(file.path, {
            folder: folderPath + `${brand.folderId}/Products/${folderId}`
        })
        Images.push({ secure_url, public_id })
    }
    req.folder = folderPath + `${brand.folderId}/Products/${folderId}`


    // prepare the product object for db 
    const product = {
        title, desc, slug, basePrice, discount, appliedPrice, stock, specs: JSON.parse(specs), categoryId, subCategoryId, brandId, addedBy, Images, folderId
    }

    const newProduct = await Product.create(product)
    req.savedDocuments = { model: Product, _id: newProduct._id }

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct })

    // res.json({
    //     massage: userdata
    // })
}

/**
 * 
 * @param {*} req body: {title, desc, basePrice, discount, stock, specs} 
 * @param {*} req params : {productId}
 * @param {*} req authUser :{_id}
 * @returns the updated product data with status 200 and success message
 * @description update a product in the database
 */



//================================================= Update product API ============================================//
export const updateProduct = async (req, res, next) => {
    // data from the request body
    const { title, desc, specs, stock, basePrice, discount, oldPublicId } = req.body
    // data for condition
    const { productId } = req.params
    // data from the request authUser
    const addedBy = req.autherith

    const userdata = await userModel.findById(addedBy)

    // prodcuct Id  
    const product = await Product.findById(productId)
    if (!product) return next({ cause: 404, message: 'Product not found' })

    // who will be authorized to update a product
    if (
        userdata.role !== SystemRole.superAdmin &&
        product.addedBy.toString() !== addedBy.toString()
    ) return next({ cause: 403, message: 'You are not authorized to update this product' })

    // title update
    if (title) {
        product.title = title
        product.slug = slugify(title, { lower: true, replacement: '-' })
    }
    if (desc) product.desc = desc
    if (specs) product.specs = JSON.parse(specs)
    if (stock) product.stock = stock

    // prices changes
    // const appliedPrice = (basePrice || product.basePrice) - ((basePrice || product.basePrice) * (discount || product.discount) / 100)
    const appliedPrice = (basePrice || product.basePrice) * (1 - ((discount || product.discount) / 100))
    product.appliedPrice = appliedPrice

    if (basePrice) product.basePrice = basePrice
    if (discount) product.discount = discount


    if (oldPublicId) {

        if (!req.file) return next({ cause: 400, message: 'Please select new image' })

        const folderPath = product.Images[0].public_id.split(`${product.folderId}/`)[0]
        const newPublicId = oldPublicId.split(`${product.folderId}/`)[1]

        // console.log('folderPath', folderPath)
        // console.log('newPublicId', newPublicId)
        // console.log(`oldPublicId`, oldPublicId);

        const { secure_url } = await cloudinaryConnection().uploader.upload(req.file.path, {
            folder: folderPath + `${product.folderId}`,
            public_id: newPublicId
        })
        product.Images.map((img) => {
            if (img.public_id === oldPublicId) {
                img.secure_url = secure_url
            }
        })
        req.folder = folderPath + `${product.folderId}`
    }


    await product.save()

    res.status(200).json({ success: true, message: 'Product updated successfully', data: product })
}

//================================================= delete product API ============================================//

export const deleteProduct = async (req, res, next) => {

    const { productId } = req.params
    // data from the request authUser
    const addedBy = req.autherith

    const userdata = await userModel.findById(addedBy)

    // prodcuct Id  
    const product = await Product.findById(productId)
    if (!product) return next({ cause: 404, message: 'Product not found' })

    // who will be authorized to update a product
    if (
        userdata.role !== SystemRole.superAdmin &&
        product.addedBy.toString() !== addedBy.toString()
    ) return next({ cause: 403, message: 'You are not authorized to update this product' })

    // delet product fronm db 
    const dleteProduct = await Product.findByIdAndDelete(productId)

    // delete product from cloudinary 

    //chick subcategory  found by id
    const subcategory = await SubCategoryModel.findById(product.subCategoryId)
    if (!subcategory) return next(new Error("the subcategory not found", { cause: 409 }))

    //chick category found by id
    const category = await categoryModel.findById(product.categoryId)

    const brands = await Brand.findById(product.brandId)


    // 1- delete any thing in the folder 

    const folderPath = `${process.env.Mian_folder}/Categories/${category.folderId}/SubCategories/${subcategory.folderId}/Brands/${brands.folderId}/Products/${product.folderId}`

    const inFolder = await cloudinaryConnection().api.delete_resources_by_prefix(folderPath)
    // 2- delet the folder 
    const folder = await cloudinaryConnection().api.delete_folder(folderPath)


    res.status(200).json({ success: true, message: 'Product delete successfully', data: product })
}


//================================================= get all product ============================================//

// export const getallproduct = async (req, res, next) => {

// // data from the request authUser
// const addedBy = req.autherith
// const userdata = await userModel.findById(addedBy)



// // who will be authorized to update a product
// if (
//     userdata.role !== SystemRole.superAdmin
// ) return next({ cause: 403, message: 'You are not authorized to update this product' })

// //get all data 
// const getproduct = await Product.find()

// res.json({
//     massage: "all product ",
//     data: getproduct
// })

// }

//================================================= get all product ============================================//
export const getallproduct = async (req, res, next) => {
    const { page, size, sort, ...search } = req.query


    // const { limit, skip } = paginationFunction({ page, size })
    // const data = await Product.find().limit(limit).skip(skip)


    const features = new APIFeatures(req.query, Product.find())
        .sort(sort)
        .pagination({ page, size })
        // .search(search)
        .filters(search)

    // console.log(features.mongooseQuery);
    const products = await features.mongooseQuery
    res.status(200).json({ success: true, data: products })
}