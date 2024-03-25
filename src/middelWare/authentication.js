import jwt from "jsonwebtoken"
import userModel from "../../db/models/user.model.js"





// accessRole is array used in autherization
export const auth = (accessRole) => {


    return async (req, res, next) => {
        try {

            // get token from req.headers ->  note dont put the cotaion in header field --> like "Token"
            const { token } = req.headers

            // chick found token or not 
            if (!token) return next(new Error("the Token Not found", { cause: 404 }))

            // chick token start with Exam_ or not 
            if (!token.startwith == "ee_") return next(new Error("the secrit token Name not found", { cause: 404 }))

            // split token and get orignal Token and decoded it 
            const decodedToken = jwt.verify(token.split("ee_")[1], process.env.user_secrectKey)

            // chick if user deleted 
            const chikUserdeleted = await userModel.findById(decodedToken.id)

            if (!chikUserdeleted) return next(new Error("user is deleted", { cause: 404 }))

            //autherization chick user role
            if (!accessRole.includes(chikUserdeleted.role)) return next(new Error("the user not autherized ", { cause: 401 }))

            //save the id user to use in controller 
            req.autherith = chikUserdeleted.id

            next()

        } catch (error) {
            return next(new Error(error, { cause: 500 }))
        }

    }



}