const order = require("../models/order");
const Order = require("../models/order");

exports.getAllOrders = (req, res, next) => {
  Order.find()
    .populate("userId", "name -_id")
    .populate({
      path: "items",
      populate: { path: "productId", select: "title -_id" },
    })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => console.log(err));
};

exports.postAddOrder = (req, res, next) => {
  const items = req.body.items;
  const userid = req.body.userId;

  const order = new Order({
    items: items,
    userId: userid,
  });

  order.save()
  .then((result) => {
    res.status(201).json(result);
  })
  .catch(err => {
    console.log(err);
  })
};

exports.deleteOrder = (req, res, next) => {
  const orderId = req.body.orderId;

  Order.findByIdAndDelete(orderId)
  .then(() => {
    Order.find()
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
}

exports.getOrderByUser = (req, res, next) => {
  const userId = req.body.userId;

  Order.find({userId: userId})
  .populate("items.productId", "title imageUrl price ")
  .then((orders) => {
    const result =orders.flatMap((order) => {
      return order.items.flatMap((item) => {
        return item
      })
    })
    return res.json(result);
  })
  .catch((err) => console.log(err));
}
