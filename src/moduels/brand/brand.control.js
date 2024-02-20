

import slugify from "slugify"
import { UniqueString, UniqueCharOTP } from "unique-string-generator"
import cloudinaryConnection from "../../utils/cloudinary.connection.utils.js"
import barndModel from "../../../db/models/brand.model.js"
import SubCategoryModel from "../../../db/models/subcategory.model.js"
import categoryModel from "../../../db/models/category.model.js"

//======================= add brand =======================//
export const addBrand = async (req, res, next) => {
    // 1- desturcture the required data from teh request object
    const { name } = req.body
    const { categoryId, subCategoryId } = req.body
    const id = req.autherith
    // category check , subcategory check
    console.log(subCategoryId + "dddd")

    // 2- subcategory check
    const subCategoryCheck = await SubCategoryModel.findById({ _id: subCategoryId }).populate('categoryId', 'folderId')
    if (!subCategoryCheck) return next({ message: 'SubCategory not found', cause: 404 })

    // 3- duplicate  brand document check 
    const isBrandExists = await barndModel.findOne({ name, subCategoryId })
    if (isBrandExists) return next({ message: 'Brand already exists for this subCategory', cause: 400 })

    // 4- categogry check
    if (categoryId != subCategoryCheck.categoryId._id) return next({ message: 'Category not found', cause: 404 })

    // 5 - generate the slug
    const slug = slugify(name, '-')

    // 6- upload brand logo
    if (!req.file) return next({ message: 'Please upload the brand logo', cause: 400 })

    const folderId = UniqueCharOTP(9)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.Mian_folder}/Categories/${subCategoryCheck.categoryId.folderId}/SubCategories/${subCategoryCheck.folderId}/Brands/${folderId}`,
    })

    const brandObject = {
        name, slug,
        Image: { secure_url, public_id },
        folderId,
        addedBy: id,
        subCategoryId,
        categoryId
    }

    const newBrand = await barndModel.create(brandObject)

    res.status(201).json({
        status: 'success',
        message: 'Brand added successfully',
        data: newBrand
    })

}

//======================= delete brand =======================//

export const deletebarnd = async (req, res, next) => {


    //2-subcategory id 
    const { brandId } = req.params
    // 3-useer id 
    const id = req.autherith


    //chick barnd  found by id
    const brands = await barndModel.findById(brandId)
    if (!brands) return next(new Error("the brand not found", { cause: 409 }))

    //chick category found by id
    const category = await categoryModel.findById({ _id: brands.categoryId })


    //chick subcategory found by id
    const subcategory = await SubCategoryModel.findById({ _id: brands.subCategoryId })


    // chick to update publicid 
    // 1- delete any thing in the folder 
    const folderPath = `${process.env.Mian_folder}/Categories/${category.folderId}/SubCategories/${subcategory.folderId}/Brands/${brands.folderId}`

    const inFolder = await cloudinaryConnection().api.delete_resources_by_prefix(folderPath)
    // 2- delet the folder 
    const folder = await cloudinaryConnection().api.delete_folder(folderPath)

    // delete from db 
    const deletedatabasesubcategory = await barndModel.findByIdAndDelete({ _id: brandId })

    res.json({
        massage: " the subcategory deleted successfly",
        data: folder
    })


}
//======================= get  all  brand =======================//

export const getAllbrandes = async (req, res, next) => {
    // 1- desturcture the required data from teh request object
    const id = req.autherith

    const allBrandes = await barndModel.find()

    res.status(201).json({
        status: 'success',
        data: allBrandes
    })

}