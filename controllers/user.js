const User = require("../models/user");


exports.postAddUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;

  const user = new User ({
    name : name,
    email : email
  })

  user.save().then(result => {
    res.send(result)
  }).catch(err => console.log(err))

};

exports.getUsers = (req, res, next) => {
  User.find()
    .then((result) => {
      res.send({ data: result, total: result.length });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUser = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUserByQuery = (req, res, next) => {
  const myname = req.query.name;
  const myemail = req.query.email;

  User.findAll({
    attributes: ["name", "id", "email"],
    where: {
      [Op.or]: {
        name: {
          [Op.like]: `%${myname}%`,
        },
        email: {
          [Op.like]: `%${myemail}%`,
        },
      }
    },
  })
    .then((result) => {
      res.json({ data: result, total: result.length });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postUpdateUser = (req, res, next) => {

  User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      name: req.body.newName,
      email: req.body.newEmail,
      role: req.body.newRole,
    }
  )
    .then((result) => {
      if (!result) {
        const error = new Error("user not found");
        error.statusCode = 403;
        throw error;
      }
      return User.find() 
    })
    .then(result => {
      res.json(result)
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteUser = (req, res, next) => {
  const { userId } = req.body;

  User.findByIdAndDelete(userId)
    .then((result) => {
      if (!result) {
        const error = new Error("user not found");
        error.statusCode = 403;
        throw error;
      }
      return User.find()
    })
    .then(result => {
      res.json(result)
    })
    .catch((err) => {
      console.log(err);
    });
};
