import jwt from "jsonwebtoken"
import userModel from "../../../db/models/user.model.js"
import bcryptjs from "bcryptjs"
import { randomInt } from "crypto"
import sendEmailService from "../Services/send.email.service.js"




// =============== 1. Sign Up user api ===================
export const adduser = async (req, res, next) => {

    const { username, email, password, recoveryEmail, mobileNumber, role, emailVerfied, isloggedin, recoveryNumber, age } = req.body

    if (!email) return next(new Error('not email enter', { cause: 404 }))
    const emailExistst = await sendEmailService({
        to: email, // 'email1' , 'email1,email2,email3'
        subject: 'no-reply',
        message: '<h1>please vervify your email </h1>',
        attachments: []
    })

    res.status(201).json({
        massage: req.body
    })

}

// =============== Sign In user api  ===================

export const signInUser = async (req, res, next) => {

    const { email, mobileNumber, password } = req.body

    // chick user found or not by mobile number or Email
    const chickuser = await userModel.findOne(
        {
            $or: [
                { email }, { mobileNumber }
            ]
        }
    )
    // chick user found or not by mobile number or Email if not return error 
    if (chickuser.length == 0) return next(new Error('user not found signUp', { cause: 404 }))

    // chich the password 
    const hashpassword = chickuser.password
    const chickPassword = bcryptjs.compareSync(password, hashpassword)

    if (!chickPassword) return next(new Error("password is invaild ", { cause: 404 }))

    // make Token to user sission 
    const makeToken = jwt.sign({ id: chickuser._id }, 'secrt')

    // update the status to online after SignIn
    const changeOfflineState = await userModel.findByIdAndUpdate(chickuser._id, { status: "online" })

    return res.status(200).json({
        massage: "the user signin",
        Token: makeToken,
        userStatus: changeOfflineState
    })

}

// =============== update account api  ===================

export const updateUserAccount = async (req, res, next) => {


    const { firstName, email, lastName, recoveryEmail, mobileNumber, DOB } = req.body
    //user must be logged in get id from sign in token
    const idFromToken = req.autherith
    // if user found 
    const chickuser = await userModel.findById(idFromToken)
    if (!chickuser) return next(new Error("the user not login ", { cause: 404 }))
    //chick user online or not 
    if (chickuser.status == "offline") return next(new Error("the user not login user offilne", { cause: 404 }))

    //ckich the mail or mobile number not found in database 
    const chikMailandMobileNumber = await userModel.findOne(
        {
            $or: [
                { email }, { mobileNumber }
            ]
        }
    )

    if (chikMailandMobileNumber) return next(new Error("this maile or mobile number is used", { cause: 404 }))

    //update data 
    const updateUserAccount = await userModel.findByIdAndUpdate(chickuser._id, { firstName, email, lastName, recoveryEmail, mobileNumber, DOB })


    return res.status(200).json({
        massage: "done account UpTodate",

    })
}

// =============== Delete account api  ===================

export const DeleteAccount = async (req, res, next) => {

    //user must be logged in get id from sign in token
    const idFromToken = req.autherith
    // if user found 
    const chickuser = await userModel.findById(idFromToken)
    if (!chickuser) return next(new Error("the user not login ", { cause: 404 }))
    //chick user online or not 
    if (chickuser.status == "offline") return next(new Error("the user not login user offilne", { cause: 404 }))
    //update data 
    const updateUserAccount = await userModel.findByIdAndDelete(chickuser._id)

    return res.status(200).json({
        massage: "the account deleted ",

    })

}

// =============== Get user account data  api  ===================

export const getUserData = async (req, res, next) => {

    //user must be logged in get id from sign in token
    const idFromToken = req.autherith
    // if user found 
    const chickuser = await userModel.findById(idFromToken)
    if (!chickuser) return next(new Error("the user not login ", { cause: 404 }))
    //chick user online or not 
    if (chickuser.status == "offline") return next(new Error("the user not login user offilne", { cause: 404 }))
    //get User Data  
    const UserData = await userModel.findOne(chickuser._id, 'email mobileNumber password -_id')

    return res.status(200).json({
        massage: "User Account Data",
        UserData: UserData

    })

}

// =============== Get profile data for another user  api  ===================

export const getProfileDataToAnotherUser = async (req, res, next) => {

    const { userId } = req.query
    console.log(req.query)
    //user must be logged in get id from sign in token
    const idFromToken = req.autherith
    // if user found 
    const chickuser = await userModel.findById(idFromToken)
    if (!chickuser) return next(new Error("the user not login ", { cause: 404 }))
    //chick user online or not 
    if (chickuser.status == "offline") return next(new Error("the user not login user offilne", { cause: 404 }))
    //get User Data  
    const UserData = await userModel.findById(userId, 'fullname email mobileNumber DOB role status -_id')

    return res.status(200).json({
        massage: "User Profile Data",
        UserData: UserData
    })

}

// =============== Update password  user api  ===================

export const Updatepassword = async (req, res, next) => {
    console.log("looool")

    const { oldPassword, newpassword } = req.body
    //user must be logged in get id from sign in token
    const idFromToken = req.autherith
    console.log("looool")
    // if user found 
    const chickuser = await userModel.findById(idFromToken)
    if (!chickuser) return next(new Error("the user not login ", { cause: 404 }))
    //chick user online or not 
    if (chickuser.status == "offline") return next(new Error("the user not login user offilne", { cause: 404 }))

    // chick the user this enter password old equail the db password 
    const decodedpassword = bcryptjs.compareSync(oldPassword, chickuser.password)

    if (!decodedpassword) return next(new Error("the old password is wrong ", { cause: 404 }))

    // hashaing new password
    const hashaingNewPassword = bcryptjs.hashSync(newpassword, +process.env.slats)
    //update password
    const updatePasswordAccount = await userModel.findByIdAndUpdate(chickuser._id, { password: hashaingNewPassword })

    return res.status(200).json({
        massage: "done account password UpTodate",

    })
}

// =============== forget password API ===================
export const forgetpassword = async (req, res, next) => {
    const { mobileNumber, email } = req.body

    // chick mobile phone or email found in db or not 
    const chickdata = await userModel.findOne(
        {
            $or: [
                { email }, { mobileNumber }
            ]
        })

    if (!chickdata) return next(new Error("this number or mail not found "))


    // make rondom number and added to db new field
    const theRondomNum = randomInt(10000, 100000)
    //update new filed in user db called recoeryNumber by this code 
    const updateRecoveryNumber = await userModel.findByIdAndUpdate(chickdata._id, { recoveryNumber: theRondomNum }, { save: true })

    return res.status(200).json({
        massage: "you can used this code to change Password",
        code: `${theRondomNum}`,
        UrlToChangePassword: "http://localhost:3000/user/chickPasswordRecovery"
    })


}
//================== chick recovery number and change password ===========

export const chickPasswordRecovery = async (req, res, next) => {

    const { recoveryNumber, newpassword } = req.body

    // serch and find the user by recovery number 

    const findUser = await userModel.findOne({ recoveryNumber })
    if (!findUser) return next(new Error("the recovery number false"))

    // hashaing new password
    const hashaingNewPassword = bcryptjs.hashSync(newpassword, +process.env.slats)
    //update password
    const updatePasswordAccount = await userModel.findByIdAndUpdate(findUser._id, { password: hashaingNewPassword })
    // make rondom number and added to db to sercuerty
    const theRondomNum = randomInt(100, 1000)
    //update new filed in user db called recoeryNumber by this code 
    const updateRecoveryNumber = await userModel.findByIdAndUpdate(findUser._id, { recoveryNumber: theRondomNum }, { save: true })

    return res.status(200).json({
        massage: "done account password UpTodate",
        UrlToLogin: "http://localhost:3000/user/signin"

    })


}

// =============== Get all accounts associated to a specific recovery Email API ===================

export const GetAllAccountByRecovaMail = async (req, res, next) => {


    const { RecovaMail } = req.body

    // find all account by recovery mail
    const chickuser = await userModel.find({ recoveryEmail: RecovaMail }, 'fullname email mobileNumber DOB role status -_id')
    if (!chickuser.length) return next(new Error("this mail not found ", { cause: 404 }))


    return res.status(200).json({
        massage: "all account belong to this recovery account ",
        allAccount: chickuser
    })
}
