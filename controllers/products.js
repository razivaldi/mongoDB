const product = require("../models/product");
const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const fs = require("fs");

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const brand = req.body.brand;
  const price = req.body.price;
  const desc = req.body.description;
  const color = req.body.color;
  const stock = req.body.stock;
  const category = req.body.category;

  const errors = validationResult(req); //menghasilkan array
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 522;
    throw error;
  }

  if (!req.files) {
    const error = new Error(
      "No image provided or file with same name already exist"
    );
    error.statusCode = 523;
    throw error;
  }

  const imageUrl = req.files.map((file) => {
    return file.path.replace("\\", "/");
  });
  console.log(imageUrl);

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: desc,
    colors: color,
    category: category,
    userId: req.userId,
    category: category,
    brand: brand,
    stock: stock,
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

exports.postUpdateProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const brand = req.body.brand;
  const price = req.body.price;
  const description = req.body.description;
  // const colors = req.body.colors;
  const category = req.body.category;
  const featured = req.body.featured;
  const stock = req.body.stock;
  const imageUrl = req.files ? req.files.map((file) => {
    return file.path.replace("\\", "/");
  }) : null

  Product.findById(productId)
  .then(product => {  
    product.title = title;
    product.brand = brand;
    product.price = price;
    product.description = description;
    // product.colors = colors;
    product.category = category;
    product.featured = featured;
    product.stock = stock;

    if(imageUrl.length > 0) {
      product.imageUrl = imageUrl;
    }
    return product.save()
  })
  .then(result => {
    res.status(200).json({message: 'Product Updated', result: result})
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .populate({
      path: "reviews",
      populate: { path: "userId", select: "name -_id" },
    })
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

exports.deleteSomeProducts = (req, res, next) => {
  const productId = req.body.productId;
  console.log(productId);
  Product.deleteMany({ _id: { $in: productId } })
  .then(result => {
    res.status(200).json({message: 'Product Deleted', result: result})
  })
  .catch(err => {
    console.log(err);
  })
}
