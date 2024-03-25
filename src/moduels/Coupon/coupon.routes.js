
import { Router } from "express";
import * as  couponController from "./coupon.controller.js";

import { auth } from "../../middelWare/authentication.js";
import expressAsyncHandler from "express-async-handler";

import { endpointsRoles } from "./coupon.endpoints.js";
import { validtion } from "../../middelWare/validation.middelware.js"
import * as validators from './coupon.validationSchemas.js';
const router = Router();

router.post('/',
    auth(endpointsRoles.ADD_COUPOUN),
    validtion(validators.addCouponSchema),
    expressAsyncHandler(couponController.addCoupon))



router.post('/valid',
    auth(endpointsRoles.ADD_COUPOUN),
    expressAsyncHandler(couponController.validteCouponApi))


export default router;