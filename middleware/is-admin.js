const User = require("../models/user");
module.exports = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (user.role === "admin") {
        next();
      } else {
        const error = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
