import Express from "express";
import * as usercontroller from './user.controller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middelWare/authentication.js";
import { SystemRole } from "../../utils/system.role.js";
import { validtion } from "../../middelWare/validation.middelware.js";
import * as userSchema from "./user.validation.schema.js";


const router = Express()


// ['User', 'Company_HR']


router.post('/adduser', expressAsyncHandler(usercontroller.adduser))
router.post('/signIn', validtion(userSchema.signin), expressAsyncHandler(usercontroller.signInUser))
router.put('/updateAccount', validtion(userSchema.updateAccount), auth(), expressAsyncHandler(usercontroller.updateUserAccount))
router.delete('/DeleteAccount', auth(), expressAsyncHandler(usercontroller.DeleteAccount))
router.get('/getUserData', auth(), expressAsyncHandler(usercontroller.getUserData))
router.get('/getDataToAnotherUser', auth([SystemRole.hr]), expressAsyncHandler(usercontroller.getProfileDataToAnotherUser))
router.put('/Updatepassword', validtion(userSchema.Updatepassword), auth([SystemRole.hr, SystemRole.user]), expressAsyncHandler(usercontroller.Updatepassword))
router.post('/forgetpassword', validtion(userSchema.forgetpassword), expressAsyncHandler(usercontroller.forgetpassword))
router.post('/chickPasswordRecovery', expressAsyncHandler(usercontroller.chickPasswordRecovery))
router.get('/getAllAccountByRecoveryMail', validtion(userSchema.GetAllAccountByRecovaMail), expressAsyncHandler(usercontroller.GetAllAccountByRecovaMail))








export default router