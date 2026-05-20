import { Router } from "express";
import { middlewareController } from "../middleware/auth.js";
import { favouritesController } from "../controllers/favouritesController.js";

const router = Router();

// add
router.post(
  "/add",
  middlewareController.verifyToken,
  favouritesController.addFavourite
);

// remove
router.post(
  "/delete",
  middlewareController.verifyToken,
  favouritesController.removeFavourite
);

// get all user's fav
router.get(
  "/getUserFavourites",
  middlewareController.verifyToken,
  favouritesController.getUserFavourites
);

export default router;
