const express = require("express");
const router = express.Router();

router.get("/add-post", (req, res, next) => {
  res.send(
    `<form action="/adminpost/add-post" method="POST">
    <label for="title">Title</label>
    <input id="title" name="title"></input>
    <label for="desc">Description</label>
    <input id="desc" name="desc"></input>
    <button type="submit">Submit</button>
    </form>`
  );
});

router.post("/add-post", (req, res, next) => {
  console.log(req.body.title);
  console.log(req.body.desc);
  res.send("post berhasil");
});

module.exports = router;
