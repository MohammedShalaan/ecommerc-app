import { Schema, model } from "mongoose"


//============================== Create the subcategory schema ==============================//

const subCategorySchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    Image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true }
    },
    folderId: { type: String, required: true, unique: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'userModel', required: true },  // superAdmin
    updatedBy: { type: Schema.Types.ObjectId, ref: 'userModel' }, // superAdmin
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

// brands virtual populate
subCategorySchema.virtual('Brands', {
    ref: 'barndModel',
    localField: '_id',
    foreignField: 'subCategoryId',
    // justOne: true
})


const SubCategoryModel = model('SubCategoryModel', subCategorySchema)
export default SubCategoryModel
