const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const cartController = require("../controllers/carts");
const shopController = require("../controllers/shop");

router.get("/", function (req, res) {
  res.send("Welcome Coding");
});

router.get("/products", productsController.getProducts);
router.get("/product/:productId", productsController.getProductById);
router.get("/product", productsController.getProductByQuery);
// router.get("/product", productsController.getProductByQuery2);
router.get("/delete-product", productsController.postDeleteProduct);
router.get("/user-cart", productsController.getCart)

// router.get("/carts", cartController.getCarts);
// router.get("/cart/:cartId", cartController.getCartById);
// router.post("/cart", cartController.postAddCart);
router.post("/add-product-cart", productsController.postAddProductToCart)
router.post("/delete-cart-item", productsController.deleteCart)
router.post("/clear-cart", productsController.clearCart)

// router.post("/delete-cart", cartController.postDeleteCart);
// router.get("/get-cart", shopController.getCart);
// router.get("/product-detail/:productId", productsController.getProductDetail);
// router.post("/post-cart", shopController.postCart);
// router.get("/orders", shopController.getOrders);
// router.post("/create-order", shopController.postOrder);
// router.post("/delete-cart-product", shopController.deleteCartProduct);

router.use("/user/:id", (req, res, next) => {
  console.log("req tipe:", req.method);
  next();
});

router.get("/user/:id", (req, res, next) => {
  console.log("middleware2");
  next();
});

router.use(
  "/user/:id",
  (req, res, next) => {
    console.log("USER ID:", req.params.id);
    next();
  },
  (req, res, next) => {
    res.send("USER");
  }
);

module.exports = router;
