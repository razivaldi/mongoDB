const product = require("../models/product");
const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  //const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const desc = req.body.description;
  const color = req.body.color;
  const category = req.body.category;

  const errors = validationResult(req); //menghasilkan array
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 522;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 523;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\", "/");

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: desc,
    colors: color,
    category: category,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.find({ price : {$gte : 900000}}).then(products => {
  // Product.find({ title: /jaket/i }, "title price colors ")
  Product.find()
    .populate("userId", "name email -_id")
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

exports.getProductByQuery = (req, res, next) => {
  const { color, price } = req.query;

  Product.find({
    $or: [{ colors: color }, { price: price }],
  })
    .then((products) => {
      if (products.length === 0) {
        return res.json({ status: 201, message: "Product not found" });
      }
      return res.json(products);
    })
    .catch((err) => console.log(err));
};

exports.getProductsBySelect = (req, res, next) => {
  Product.find()
    .select("title price -_id")
    .populate("userId", "name")
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByIdAndDelete(productId)
    .then(() => {
      res.send("Product Deleted");
    })
    .catch((err) => console.log(err));
};

exports.getProductByQuery2 = (req, res, next) => {
  const { search, price } = req.query;

  let myquery = Product.find().select("title price -_id");

  if (search) {
    myquery.where("title").equals({ $regex: search });
  }

  if (price) {
    myquery.where("price").gte(price);
  }

  myquery
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

exports.postAddProductToCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getAllCart = (req, res, next) => {
  User.find({ cart: { $exists: true } })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  User.findById(req.user._id)
    .populate("cart.items.productId")
    .then((result) => {
      res.send(result);
    });
};

exports.deleteCart = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .deleteCartItem(productId)
    .then((cart) => {
      res.json(cart);
    })
    .catch((err) => console.log(err));
};

exports.clearCart = (req, res, next) => {
  req.user
    .clearCart()
    .then(() => {
      res.send("cart cleared");
    })
    .catch((err) => console.log(err));
};
