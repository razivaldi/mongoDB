const express = require("express");
const router = express.Router();

router.get(
  "/",
  (req, res, next) => {
    console.log("new request");
    next();
  },
  (req, res, next) => {
    res.send("Processing request");
  }
);

router.get("/posts/:param", (req, res) => {
  res.send("Posted: " + req.params.param);
});

router.get("/print", (req, res) => {
  res.send(req.query.text);
});

router.get("/add", (req, res, next) => {
  const result = parseInt(req.query.a) + parseInt(req.query.b);
  console.log(result);
  res.send(result.toString());
});

module.exports = router;
