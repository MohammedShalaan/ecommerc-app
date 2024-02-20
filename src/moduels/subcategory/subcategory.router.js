import Express from "express";
import { auth } from "../../middelWare/authentication.js";
import expressAsyncHandler from "express-async-handler";
import * as subcategories from "./subcategory.control.js"
import { multerMiddelcloudHost } from "../../middelWare/multer.middelWare.js";
import { multerFormatAllowed } from "../../utils/multer.formatAllowed.utils.js";
import { SystemRole } from "../../utils/system.role.js";
const router = Express()


//============================== Router Api ==========================

router.post('/deletecategores', expressAsyncHandler(subcategories.deletecategores))
router.post('/addsubcategories/:categoryId', auth(SystemRole.superAdmin), multerMiddelcloudHost({ extentions: multerFormatAllowed.Image }).single('imge'), expressAsyncHandler(subcategories.addsubcategories))
router.put('/updatesubcategory/:subcategoryId', auth(SystemRole.superAdmin), multerMiddelcloudHost({ extentions: multerFormatAllowed.Image }).single('imge'), expressAsyncHandler(subcategories.updatesubcategory))
router.delete('/deletesubcategory/:subcategoryId', auth(SystemRole.superAdmin), expressAsyncHandler(subcategories.deletesubcategory))


//============================== Router Api ==========================

export default router