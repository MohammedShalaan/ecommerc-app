import Express from "express";
import { auth } from "../../middelWare/authentication.js";
import expressAsyncHandler from "express-async-handler";
import * as brandcontrol from "./brand.control.js"
import { multerMiddelcloudHost } from "../../middelWare/multer.middelWare.js";
import { multerFormatAllowed } from "../../utils/multer.formatAllowed.utils.js";
import { SystemRole } from "../../utils/system.role.js";
const router = Express()


//============================== Router Api ==========================

router.post('/addBrand', auth(SystemRole.superAdmin), multerMiddelcloudHost({ extentions: multerFormatAllowed.Image }).single('imge'), expressAsyncHandler(brandcontrol.addBrand))
router.get('/getAllbrandes', auth(SystemRole.superAdmin), expressAsyncHandler(brandcontrol.getAllbrandes))
router.delete('/deletebarnd/:brandId', auth(SystemRole.superAdmin), expressAsyncHandler(brandcontrol.deletebarnd))




// router.put('/updatecategory/:categoryId', auth(SystemRole.superAdmin), multerMiddelcloudHost({ extentions: multerFormatAllowed.Image }).single('imge'), expressAsyncHandler(categoryControl.updatecategory))
// router.get('/getallcategores', auth(SystemRole.superAdmin), expressAsyncHandler(categoryControl.getallcategores))



//============================== Router Api ==========================

export default router