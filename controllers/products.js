const product = require("../models/product");
const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const fs = require("fs");

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
    const error = new Error("No image provided or file with same name already exist");
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
    userId: req.userId,
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

exports.postUpdateProductsByUserLogin = (req, res, next) => {
  
  if (!req.file) {
    const error = new Error("No image provided or File with the same name already exist");
    error.statusCode = 523;
    throw error;
  }
  console.log(req.file)

  const imageUrl = req.file.path.replace("\\", "/");

  Product.findOneAndUpdate(
    { $and: [{ userId: req.userId }, { _id: req.body.productId }] },
    {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      imageUrl: imageUrl,
      colors: req.body.colors,
    }
  )
    .then((result) => {
      if (!result) {
        const error = new Error("Access Forbidden");
        error.statusCode = 403;
        throw error;
      }
    })
    .then(() => {
      return Product.findOne({ _id: req.body.productId })
    })
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      if(!err.statusCode){
        err.statusCode = 500;
      }
      console.log(err)
      next(err);
    });
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
