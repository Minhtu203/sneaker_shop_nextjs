import { Router } from "express";
import { middlewareController } from "../middleware/auth.js";
import { cartController } from "../controllers/cartController.js";

const router = Router();

// add to cart
router.post("/add", middlewareController.verifyToken, cartController.addToCart);

//get all items in cart
router.get(
  "/getAllItems",
  middlewareController.verifyToken,
  cartController.getAllItemsInCart
);

// remove item from cart
router.post(
  "/deleteItem",
  middlewareController.verifyToken,
  cartController.deleteItem
);

export default router;
