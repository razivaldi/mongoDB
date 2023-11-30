const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const adminRouter = require("../routes/admin");
const shopRouter = require("../routes/shop");
const User = require("../models/user");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const authRoute = require("../routes/auth");
const cookieParser = require("cookie-parser");
const fs = require("fs");

console.log("start express server");

// app.use(cors());
app.use(cors({ credentials: true, origin: "*" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/auth", authRoute);

// app.use((req, res, next) => {
//   console.log("Time: ", Date.now());
//   User.findById("653f7da45b77849b2f0b4157")
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.use("/images", express.static(path.join(__dirname, "images")));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const fileExis = fs.readdirSync("images").filter((name) => {
    return name.includes(file.originalname);
  });

  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/avif"
  ) {
    // if (fileExis.length > 0) {
    //   const error = new Error("File already exists");
    //   error.statusCode = 523;
    //   cb(error, false);
    // } else {
    //   cb(null, true);
    // }
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("imageUrl", 7) 
  // multer({ storage: fileStorage, fileFilter: fileFilter }).single("image") //single upload file, image adalah nama field
);

app.use("/admin", adminRouter);
app.use("/shop", shopRouter);
// app.use("/middle", middleRouter);
// app.use("/adminpost", adminpostRouter);

app.use((req, res, next) => {
  res.status(404).send("<h1>Anda Tersesat</h1>");
});

app.use((error, req, res, next) => {
  console.log("error ditemukan");
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({
    message: message,
  });
});

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://razivaldi15:vxoH1wgyCcO2tmZu@cluster0.682rfr0.mongodb.net/ecommerse?retryWrites=true&w=majority"
  )
  .then((res) => app.listen(8000))
  .catch((err) => console.log(err));
