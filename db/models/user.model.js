
import { Schema, model } from "mongoose";


const userschema = new Schema(
    {

        username: {
            type: String,
            require: true,
            tirm: true,
            lowercase: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            require: true,
        },

        recoveryEmail: {
            type: String,
            require: true,
        },

        mobileNumber: {
            type: Number,
            require: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ['User', 'admin', 'superAdmin'],
            default: 'User'
        },
        emailVerfied: {
            type: Boolean,
            default: false,

        },
        isloggedin: {
            type: Boolean,
            default: 'false'
        },
        recoveryNumber: {
            type: Number,
        },
        age: {
            type: Number,
            min: 18,
            max: 100,
        },
    }, {
    timestamps: true
}
)


const userModel = model('userModel', userschema)

export default userModel