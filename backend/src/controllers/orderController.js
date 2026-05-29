import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const allOrders = await Order.find();
      res.status(200).json({ success: true, data: allOrders });
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
        paymentCode,
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

      if (!paymentCode)
        return res
          .status(400)
          .json({ success: false, message: "Missing paymentCode" });

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
        paymentCode,
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

  //update order
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, isPaid } = req.body;

      const order = await Order.findById(id);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found!" });
      }
      // 2. Logic cập nhật trạng thái thanh toán tự động
      if (isPaid !== undefined) {
        order.isPaid = isPaid;
        if (isPaid && !order.paidAt) {
          order.paidAt = new Date();
        } else if (!isPaid) {
          order.paidAt = null;
        }
      }
      if (status) {
        const validStatuses = [
          "Pending",
          "Confirmed",
          "Shipping",
          "Delivered",
          "Cancelled",
        ];
        if (!validStatuses.includes(status)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid order status!" });
        }
        order.status = status;
      }
      const updatedOrder = await order.save();
      res.status(200).json({
        success: true,
        message: "Update order successfully.",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Failed to update order:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
};
