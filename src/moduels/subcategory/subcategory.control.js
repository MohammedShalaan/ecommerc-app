import slugify from "slugify"
import categoryModel from "../../../db/models/category.model.js"
import cloudinaryConnection from "../../utils/cloudinary.connection.utils.js"
import { UniqueString, UniqueCharOTP } from "unique-string-generator"
import SubCategoryModel from "../../../db/models/subcategory.model.js"


//============================== add SubCategory ==============================//

export const addsubcategories = async (req, res, next) => {

    const { name } = req.body
    const { categoryId } = req.params
    const id = req.autherith


    // 2- check if the subcategory name is already exist
    const subcategory = await SubCategoryModel.findOne({ name })
    if (subcategory) return next(new Error("the subcategory found enter another subcategory", { cause: 404 }))

    // 3- check if the category is exist by using categoryId
    const category = await categoryModel.findById(categoryId)
    if (!category) return next({ cause: 404, message: 'Category not found' })

    // 4- add sligfy
    const slug = slugify(name, '-')


    // 5- upload image to cloudinary
    if (!req.file) return next(new Error("imge is required", { cause: 409 }))

    const folderId = UniqueCharOTP(9)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.Mian_folder}/Categories/${category.folderId}/SubCategories/${folderId}`
    })

    // 6- generate the subCategory object
    const addsubCategory = await SubCategoryModel.create({
        name,
        slug,
        Image: { secure_url, public_id },
        folderId,
        addedBy: id,
        categoryId
    })

    res.json({
        massage: " the subcategory added successfily",
        data: addsubCategory
    })

}
//=========================== update subcategory ========================

export const updatesubcategory = async (req, res, next) => {

    //1- destructing the requsest body
    const { name, oldPublicid } = req.body
    //2-subcategory id 
    const { subcategoryId } = req.params
    // 3-useer id 
    const id = req.autherith


    //chick subcategory  found by id
    const subcategory = await SubCategoryModel.findById(subcategoryId)
    if (!subcategory) return next(new Error("the subcategory not found", { cause: 409 }))

    //chick category found by id
    const category = await categoryModel.findById({ _id: subcategory.categoryId })
    // 5- chick if user want to update the name field 

    if (name) {

        if (name == subcategory.name) {
            return next(new Error("enter deffrent subcategory name", { cause: 409 }))
        }
        const isNameDuplicated = await SubCategoryModel.findOne({ name })
        if (isNameDuplicated) {
            return next(new Error("subcategory name is alredy exist", { cause: 409 }))
        }
        //update the category name 
        const updatecategory = await SubCategoryModel.findByIdAndUpdate({ _id: subcategory._id }, { name, slug: slugify(name, "-") })

    }
    // chick to update publicid 

    if (oldPublicid) {
        console.log(oldPublicid)
        if (!req.file) return next(new Error("imge is required", { cause: 409 }))
        const theNewcategoryPublicid = oldPublicid.split(`/${subcategory.folderId}/`)[1]
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {

            folder: `${process.env.Mian_folder}/Categories/${category.folderId}/SubCategories/${subcategory.folderId}`,
            public_id: theNewcategoryPublicid
        })

        console.log(public_id)
        // const imgedateUpdate = await categoryModel.findByIdAndUpdate({ _id: category._id }, { Image: { public_id }, })
        subcategory.Image.secure_url = secure_url
    }
    // const userUpdate = await categoryModel.findByIdAndUpdate({ _id: category._id }, { updatedBy: id })
    subcategory.updatedBy = id
    await subcategory.save()

    res.json({
        massage: " the subcategory updated successfly",
        data: subcategory
    })


}

//=========================== get all subcategory  with brands========================
export const getallcategores = async (req, res, next) => {

    const getAllCategores = await categoryModel.find()
    res.json({
        massage: "all categores",
        data: getAllCategores
    })
}


//=========================== delete sub category ========================

export const deletesubcategory = async (req, res, next) => {


    //2-subcategory id 
    const { subcategoryId } = req.params
    // 3-useer id 
    const id = req.autherith


    //chick subcategory  found by id
    const subcategory = await SubCategoryModel.findById(subcategoryId)
    if (!subcategory) return next(new Error("the subcategory not found", { cause: 409 }))

    //chick category found by id
    const category = await categoryModel.findById({ _id: subcategory.categoryId })


    // chick to update publicid 
    // 1- delete any thing in the folder 

    const folderPath = `${process.env.Mian_folder}/Categories/${category.folderId}/SubCategories/${subcategory.folderId}`

    const inFolder = await cloudinaryConnection().api.delete_resources_by_prefix(folderPath)
    // 2- delet the folder 
    const folder = await cloudinaryConnection().api.delete_folder(folderPath)

    // delete from db 
    const deletedatabasesubcategory = await SubCategoryModel.findByIdAndDelete({ _id: subcategoryId })

    res.json({
        massage: " the subcategory deleted successfly",
        data: folder
    })


}


//=========================== delete all categores all  category ========================
export const deletecategores = async (req, res, next) => {


    const data = await cloudinaryConnection().api.delete_resources_by_prefix("category/")

    if (data) {
        const data = await cloudinaryConnection().api.delete_folder("category")
        const deletedatabasesubcategory = await SubCategoryModel.deleteMany()
        const deletedatabasecategory = await categoryModel.deleteMany()
        res.json({
            massage: data,
        })
    }


}