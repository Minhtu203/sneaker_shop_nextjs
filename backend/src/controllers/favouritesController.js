import Favourites from "../models/favouritesModel.js";

export const favouritesController = {
  // add
  addFavourite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;
      if (!productId)
        return res
          .status(403)
          .json({ success: false, message: "Missing required field" });
      const existingFav = await Favourites.findOne({
        userId,
        productId,
      });
      if (existingFav)
        return res
          .status(404)
          .json({ success: false, message: "Already added to favourites" });

      const favourite = await Favourites.create({ userId, productId });
      res
        .status(200)
        .json({ success: true, message: "Added to favourites", favourite });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  // remove
  removeFavourite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;
      const deleted = await Favourites.findOneAndDelete({
        userId,
        productId,
      });
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "Something wrong" });
      res
        .status(200)
        .json({ success: true, message: "Removed from favourite" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  // get user's favourites
  getUserFavourites: async (req, res) => {
    try {
      const userId = req.user.id;
      const fav = await Favourites.find({ userId }).populate("productId");
      res.status(200).json({ success: true, fav });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
