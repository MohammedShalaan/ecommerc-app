
import Express from "express";
import * as  cartController from "./cart.controller.js";
import { auth } from "../../middelWare/authentication.js";
import expressAsyncHandler from "express-async-handler";
import { SystemRole } from "../../utils/system.role.js";
const router = Express()






router.post('/addCard', auth(SystemRole.user), expressAsyncHandler(cartController.addProductToCart))

router.put('/deleteOnCard/:productId', auth(SystemRole.user), expressAsyncHandler(cartController.removeFromcart))

export default router;