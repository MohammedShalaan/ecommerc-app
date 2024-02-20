
// import joiDate from "@joi/date"
import joi from "joi"

export const userSignUpSchema = {

    body: joi.object({
        firstName: joi.string().max(15),
        lastName: joi.string().max(15),
        email: joi.string().email({ tlds: { allow: ["com"] } }),
        recoveryEmail: joi.string().email({ tlds: { allow: ["com"] } }),
        mobileNumber: joi.number(),
        password: joi.string().required(),
        DOB: joi.string(),
        role: joi.string().valid('User', 'Company_HR').required(),
        cpassword: joi.string().valid(joi.ref('password'))
    }).with('password', 'cpassword'),

    // query: joi.object({
    //     test: joi.number().max(2)
    // })
}

export const signin = {
    body: joi.object({
        email: joi.string().email({ tlds: { allow: ["com"] } }),
        mobileNumber: joi.number(),
        password: joi.string().required(),

    })
}

export const updateAccount = {
    body: joi.object({

        firstName: joi.string().max(15),
        lastName: joi.string().max(15),
        email: joi.string().email({ tlds: { allow: ["com"] } }),
        recoveryEmail: joi.string().email({ tlds: { allow: ["com"] } }),
        mobileNumber: joi.number(),
        DOB: joi.string(),

    })
}

export const Updatepassword = {
    body: joi.object({
        oldPassword: joi.string().required(),
        newpassword: joi.string().required(),
        cpassword: joi.string().valid(joi.ref('newpassword'))
    }).with('newpassword', 'cpassword')
}

export const GetAllAccountByRecovaMail = {
    body: joi.object({
        RecovaMail: joi.string().email({ tlds: { allow: ["com"] } }),
    })
}
export const forgetpassword = {
    body: joi.object({
        email: joi.string().email({ tlds: { allow: ["com"] } }),
        mobileNumber: joi.number(),
    })
}
export const chickPasswordRecovery = {
    body: joi.object({
        recoveryNumber: joi.string().required(),
        newpassword: joi.string().required(),
        cpassword: joi.string().valid(joi.ref('newpassword'))
    }).with('newpassword', 'cpassword')
}