import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const allOrders = await Order.find();
      res.status(200).json({ success: true, allOrders });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  //create order
  createOrder: async (req, res) => {
    try {
      const {
        totalAmount,
        // address,
        items,
        shippingAddress,
        paymentMethod,
        note,
      } = req.body;

      const userId = req.user.id;

      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "Missing userId" });

      if (!totalAmount || totalAmount < 0)
        return res
          .status(400)
          .json({ success: false, message: "Missing totalAmount" });

      if (!items || items.length === 0)
        return res
          .status(400)
          .json({ success: false, message: "Items cannot be empty" });

      if (
        !shippingAddress ||
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.address ||
        !shippingAddress.city
      )
        return res
          .status(400)
          .json({ success: false, message: "Missing shippingAddress fields" });

      const newOrder = await Order.create({
        userId,
        totalAmount,
        // address,
        items,
        shippingAddress,
        paymentMethod,
        note,
      });
      res.status(200).json({ success: true, data: newOrder });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      console.log(11111, error);
    }
  },

  // delete order
  deleteOrder: async (req, res) => {
    try {
      const orderId = req.body.orderId;
      const deleteOrder = await Order.findByIdAndDelete(orderId);
      if (!deleteOrder)
        return res
          .status(404)
          .json({ success: false, message: "Can not find order's ID" });
      res
        .status(200)
        .json({ success: true, message: "Delete order successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
