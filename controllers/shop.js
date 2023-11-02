const Product = require("../models/product");
const { Op } = require("sequelize");
const sequelize = require("../util/database");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItems");
const ImageProduct = require("../models/imageProduct");

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts({
          include: [{ model: ImageProduct, as: "images" }],
        })
        .then((products) => {
          const transformed = products.map((product) => {
            let tempcolors = [];
            if (product.colors.indexOf(",") > 0) {
              tempcolors = product.colors.split(",");
            }
            tempcolors.push(product.colors);
            product.colors = tempcolors;
          });
          res.send({ status: "success", data: products });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { productId, qty, color } = req.body;
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts({ where: { id: productId } })
        .then((products) => {
          const product = products[0];
          if (!product) {
            return cart.addProduct(productId, {
              through: { quantity: qty, color: color },
            });
          }
          const oldqty = product.cartItem.quantity;
          return product.cartItem.update({ quantity: Number(qty) + oldqty });
        })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteCartProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user.getCart().then((cart) => {
    cart.getProducts({ where: { id: productId } }).then((products) => {
      const product = products[0];
      if (!product) {
        return res.json({ status: 201, message: "Product not found" });
      }
      product.cartItem.destroy();
    });
    return res.json({ status: 201, message: "Product deleted", data: cart });
  });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({
      include: [{ model: Product }],
      attribute: ["id"],
    })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => console.log(err));
};

