const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const userController = require("../controllers/user");
const cartController = require("../controllers/carts");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

router.post(
  "/product",
  [
    body("title").trim().isLength({ min: 5 }),
    body("price").trim().isLength({ min: 3 }),
    body("price").toInt(),
    isAuth
  ],
  productsController.postAddProduct
);

router.get("/carts", isAuth, productsController.getAllCart);
// router.post("/edit-product", productsController.postEditProduct);
// router.post("/delete-product", productsController.postDeleteProduct);
router.post("/add-user", userController.postAddUser);
// router.post("/delete-user", userController.postDeleteUser);
// router.post("/edit-user", userController.postEditUser);
// router.get("/users", userController.getUsers);
router.get("/user/userId", isAuth, isAdmin, userController.getUser);
// router.get("/user", userController.getUserByQuery);
// router.get("/cart/:userId", cartController.getCartByUserId);
// router.get("/user-products", productsController.getProductByUser);
// router.get("/edit-user-product/:productId", productsController.getEditUserProduct);
// router.get("/user-details/:userId", productsController.getProductByAdmin);

module.exports = router;
