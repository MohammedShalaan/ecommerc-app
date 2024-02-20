import Express from "express";
import * as authRouter from "./auth.control.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from '../../middelWare/authentication.js'
const router = Express()


//--------------------- all API -----------------------
router.post('/adduser', expressAsyncHandler(authRouter.adduser))
router.get('/vervify-email', expressAsyncHandler(authRouter.verifyEmail))
router.post('/signin', expressAsyncHandler(authRouter.signin))
router.put('/updateUserAccount', auth(), expressAsyncHandler(authRouter.updateUserAccount))
router.delete('/deletaccount', auth(), expressAsyncHandler(authRouter.deletaccount))
router.get('/getProfileData', auth(), expressAsyncHandler(authRouter.getProfileData))


export default router