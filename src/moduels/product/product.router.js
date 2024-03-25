import Express from "express";
import { auth } from "../../middelWare/authentication.js";
import expressAsyncHandler from "express-async-handler";
import { SystemRole } from "../../utils/system.role.js";
import * as productControl from "./product.control.js"
import { multerMiddelcloudHost } from "../../middelWare/multer.middelWare.js";
import { multerFormatAllowed } from "../../utils/multer.formatAllowed.utils.js";
const router = Express()


//============================== Router Api ==========================
router.post('/addproduct', auth(SystemRole.superAdmin), multerMiddelcloudHost({ extentions: multerFormatAllowed.Image }).array('image', 3), expressAsyncHandler(productControl.addProduct))
router.put('/updateproduct/:productId', auth(SystemRole.superAdmin), multerMiddelcloudHost({ extentions: multerFormatAllowed.Image }).single('image'), expressAsyncHandler(productControl.updateProduct))
router.delete('/deleteProduct/:productId', auth(SystemRole.superAdmin), expressAsyncHandler(productControl.deleteProduct))
router.get('/allProduct', auth(SystemRole.superAdmin), expressAsyncHandler(productControl.getallproduct))





//============================== Router Api ==========================

export default router