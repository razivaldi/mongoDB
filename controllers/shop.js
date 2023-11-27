const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItems");
const ImageProduct = require("../models/imageProduct");
const axios = require("axios");

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

exports.getCategories = (req, res, next) => {
  axios
    .get("https://63cdf885d2e8c29a9bced636.mockapi.io/api/v1/categories")
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("call category");
    });
};

exports.postAddReview = (req, res, next) => {
  const productId = req.body.productId;
  const message = req.body.message;
  const rating = req.body.rating;
  const userId = req.userId;

  Product.findById(productId)
    .then((product) => {
      product.addReview(userId, message, rating);
    })
    .then(() => {
      res.send({ status: 201, message: "review added" });
    })
    .catch((err) => console.log(err));
};
