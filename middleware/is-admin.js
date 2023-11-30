const User = require("../models/user");
module.exports = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (user.role === "admin") {
        next();
      } else {
        res.status(201).json({
          message: "You dont have permission to access",
        })
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
