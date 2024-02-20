import userModel from "../../../db/models/user.model.js"
import bcryptjs from "bcryptjs"
import Jwt from "jsonwebtoken"
import sendEmailService from "../Services/send.email.service.js"




//============================ add user api =====================
export const adduser = async (req, res, next) => {

    const { username, email, password, recoveryEmail, mobileNumber, role, emailVerfied, isloggedin, recoveryNumber, age } = req.body


    //chick email is duplicated 
    const isEmailDuplicated = await userModel.findOne({ email })
    if (isEmailDuplicated) return next(new Error(' email is duplcated ', { cause: 404 }))


    const decodeemail = Jwt.sign({ email }, process.env.verifyEmail, { expiresIn: '120s' })
    //send  email to verfiy 
    const emailExistst = await sendEmailService({
        to: email, // 'email1' , 'email1,email2,email3'
        subject: 'no-reply',
        message: `<h1>please vervify your email </h1>
        <h2> Please click in this email to verfiay Email </h2> 
        <a href="http://localhost:3000/auth/vervify-email?token=${decodeemail}">Verfiy email</a>`,
        attachments: []
    })
    if (!emailExistst) return next(new Error(' email is not send triy again ', { cause: 404 }))

    //hashing password 
    const hashpassword = bcryptjs.hashSync(password, + process.env.slats)

    // create document in mongooes db 
    const createUser = await userModel.create({ username, email, password: hashpassword, recoveryEmail, mobileNumber, role, emailVerfied, isloggedin, recoveryNumber, age })


    res.status(201).json({
        massage: createUser
    })

}

//============================ verfay email api =====================

export const verifyEmail = async (req, res, next) => {
    const { token } = req.query
    const decodedData = Jwt.verify(token, process.env.verifyEmail)

    const findEmailAndVrefay = await userModel.findOneAndUpdate({ email: decodedData.email, emailVerfied: false }, { emailVerfied: true }, { new: true })


    if (!findEmailAndVrefay) return next(new Error(' email is verfied or not found ', { cause: 404 }))

    res.status(201).json({
        massage: findEmailAndVrefay
    })
}

//============================ sign in  user  =====================

export const signin = async (req, res, next) => {
    const { email, password } = req.body

    // chik email user found 
    const chickMailAndVerefied = await userModel.findOne({ email, emailVerfied: true })
    if (!chickMailAndVerefied) return next(new Error("email not found or not vrefied ", { cause: 404 }))

    //chick password 
    const decodedPassword = bcryptjs.compareSync(password, chickMailAndVerefied.password)
    if (!decodedPassword) return next(new Error("the password error ", { cause: 404 }))


    //generate login Token 
    const token = Jwt.sign({ email, isloggedin: chickMailAndVerefied.isloggedin, id: chickMailAndVerefied._id }, process.env.user_secrectKey, { expiresIn: '1d' })


    //update the database 
    const updateone = await userModel.findOneAndUpdate({ _id: chickMailAndVerefied._id }, { isloggedin: true })
    // userModel.isloggedin = true
    // await userModel.save()

    res.status(201).json({
        massage: "user logged in succsefily",
        data: token,
        lol: updateone
    })

}


//============================ update profile user   =====================
export const updateUserAccount = async (req, res, next) => {


    const { username, email, password, recoveryEmail, mobileNumber, recoveryNumber, age } = req.body

    //user must be logged in get id from sign in token
    const idFromToken = req.autherith
    // if user found 
    const chickuser = await userModel.findById(idFromToken)

    if (!chickuser) return next(new Error("the user not found ", { cause: 404 }))

    //chick user online or not 
    if (chickuser.isloggedin == "false") return next(new Error("the user not login user offilne", { cause: 404 }))

    //ckich the mail or mobile number not found in database 
    const chikMailandMobileNumber = await userModel.findOne(
        {
            $or: [
                { email }, { mobileNumber }
            ]
        }
    )

    //hashing password 
    const hashpassword = bcryptjs.hashSync(password, + process.env.slats)

    if (chikMailandMobileNumber) return next(new Error("this Email or mobile number is used", { cause: 404 }))

    //update data 
    const updateUserAccount = await userModel.findByIdAndUpdate(chickuser._id, { username, email, password: hashpassword, recoveryEmail, mobileNumber, recoveryNumber, age })


    return res.status(200).json({
        massage: "done account UpTodate",
        data: updateUserAccount

    })
}

//============================ delete profile user   =====================
export const deletaccount = async (req, res, next) => {


    //user must be logged in get id from sign in token
    const idFromToken = req.autherith
    // if user found 
    const chickuser = await userModel.findById(idFromToken)

    if (!chickuser) return next(new Error("the user not found ", { cause: 404 }))

    //chick user online or not 
    if (chickuser.isloggedin == "false") return next(new Error("the user not login user offilne", { cause: 404 }))

    //delete data 
    const deleteUserAccount = await userModel.findByIdAndDelete(chickuser._id)


    return res.status(200).json({
        massage: "done account deleted",
        data: deleteUserAccount

    })
}


//============================ get all data   =====================
export const getProfileData = async (req, res, next) => {


    //user must be logged in get id from sign in token
    const idFromToken = req.autherith
    // if user found 
    const chickuser = await userModel.findById(idFromToken)

    if (!chickuser) return next(new Error("the user not found ", { cause: 404 }))

    //chick user online or not 
    if (chickuser.isloggedin == "false") return next(new Error("the user not login user offilne", { cause: 404 }))


    return res.status(200).json({
        massage: "account profile data",
        data: chickuser
    })
}