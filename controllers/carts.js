const Cart = require("../models/cart");

exports.getCarts = (req, res, next) => {
  Cart.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
};

exports.getCartById = (req, res, next) => {
  const cartId = req.params.cartId;

  Cart.findById(cartId)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
}

exports.postAddCart = (req, res, next) => {
  const userId = req.body.userId;
  console.log(userId);

  const cart = new Cart({
    userId: userId,
  });

  cart
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteCart = async (req, res, next) => {
  const cartId = req.body.cartId;

  await sequelize.query(`DELETE FROM carts WHERE id = ${cartId}`, {
    model: Cart,
    mapToModel: true,
  });
  res.send("berhasil dihapus");
};
