import slugify from "slugify"
import categoryModel from "../../../db/models/category.model.js"
import cloudinaryConnection from "../../utils/cloudinary.connection.utils.js"
import { UniqueString, UniqueCharOTP } from "unique-string-generator"








//=========================== add category ========================
export const addcategory = async (req, res, next) => {

    const { name } = req.body
    const id = req.autherith


    //1-chick the  duplcate category 
    const categoryChick = await categoryModel.findOne({ name })
    if (categoryChick) return next(new Error("the category found", { cause: 404 }))

    // 2- add sligfy
    const slug = slugify(name, '-')

    // 3-upload onw image
    if (!req.file) return next(new Error("imge is required", { cause: 409 }))

    // { secure_url, public_id }
    const uniqstring = UniqueCharOTP(9)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.Mian_folder}/Categories/${uniqstring}`
    })

    //4-chick the  duplcate category 
    const addCategory = await categoryModel.create({
        name,
        slug,
        Image: { secure_url, public_id },
        folderId: uniqstring,
        addedBy: id
    })

    res.json({
        massage: " the category addel successfily",
        data: addCategory
    })

}
//=========================== update category ========================

export const updatecategory = async (req, res, next) => {

    //1- destructing the requsest body
    const { name, oldPublicid } = req.body
    //2-category id 
    const { categoryId } = req.params
    // 3-useer id 
    const iduser = req.autherith


    //chick category  found by id
    const category = await categoryModel.findById(categoryId)
    if (!category) return next(new Error("the category not found", { cause: 409 }))

    // 5- chick if user want to update the name field 
    if (name) {

        if (name == category.name) {
            return next(new Error("enter deffrent category name", { cause: 409 }))
        }
        const isNameDuplicated = await categoryModel.findOne({ name })
        if (isNameDuplicated) {
            return next(new Error("category name is alredy exist", { cause: 409 }))
        }
        //update the category name 
        const updatecategory = await categoryModel.findByIdAndUpdate({ _id: category._id }, { name, slug: slugify(name, "-") })
        // category.name = name
        // category.slug = slugify(name, "-")

    }

    // chick to update publicid 
    if (oldPublicid) {
        console.log(oldPublicid)
        if (!req.file) return next(new Error("imge is required", { cause: 409 }))
        const theNewcategoryPublicid = oldPublicid.split(`/${category.folderId}/`)[1]
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {

            folder: `${process.env.Mian_folder}/Categories/${category.folderId}`,
            public_id: theNewcategoryPublicid
        })
        console.log(public_id)
        // const imgedateUpdate = await categoryModel.findByIdAndUpdate({ _id: category._id }, { Image: { public_id }, })
        category.Image.secure_url = secure_url
    }
    // const userUpdate = await categoryModel.findByIdAndUpdate({ _id: category._id }, { updatedBy: id })
    category.updatedBy = iduser
    await category.save()

    res.json({
        massage: " the category updated successfly",
        data: category
    })


}

//=========================== get all category ========================
export const getallcategores = async (req, res, next) => {

    const getAllCategores = await categoryModel.find().populate([{
        path: "subcategories",
        populate: [{
            path: "Brands"
        }]
    }])

    res.json({
        massage: "all categores and sub category ",
        data: getAllCategores
    })
}

//=========================== get all category with sub catagory ========================
// export const getCategoryandSub = async (req, res, next) => {


// }