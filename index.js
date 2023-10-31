const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const User = require("./models/user");

console.log("start express server");

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  User.findById("653f7da45b77849b2f0b4157")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRouter);
app.use("/shop", shopRouter);
// app.use("/middle", middleRouter);
// app.use("/adminpost", adminpostRouter);

app.use((req, res, next) => {
  res.status(404).send("<h1>Anda Tersesat</h1>");
});

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://razivaldi15:vxoH1wgyCcO2tmZu@cluster0.682rfr0.mongodb.net/ecommerse?retryWrites=true&w=majority"
  )
  .then((res) => app.listen(8000))
  .catch((err) => console.log(err));
