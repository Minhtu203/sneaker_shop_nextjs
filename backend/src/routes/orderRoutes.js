import { Router } from "express";
import { middlewareController } from "../middleware/auth.js";
import { orderController } from "../controllers/orderController.js";

const router = Router();

// get all orders
router.get(
  "/getAllOrders",
  middlewareController.verifyAdminToken,
  orderController.getAllOrders
);

//create order
router.post(
  "/createOrder",
  middlewareController.verifyAdminToken,
  orderController.createOrder
);

//delete order
router.post(
  "/deleteOrder",
  middlewareController.verifyAdminToken,
  orderController.deleteOrder
);

export default router;
