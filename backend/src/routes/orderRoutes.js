import { Router } from "express";
import { middlewareController } from "../middleware/auth.js";
import { orderController } from "../controllers/orderController.js";

const router = Router();

// get all orders
router.get(
  "/getAllOrders",
  middlewareController.verifyAdminToken,
  orderController.getAllOrders,
);

//create order
router.post(
  "/createOrder",
  middlewareController.verifyToken,
  orderController.createOrder,
);

//delete order
router.post(
  "/deleteOrder",
  middlewareController.verifyAdminToken,
  orderController.deleteOrder,
);

// update order
router.post(
  "/update/:id",
  middlewareController.verifyAdminToken,
  orderController.updateOrder,
);

export default router;
