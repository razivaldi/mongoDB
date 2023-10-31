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
  User.findAll()
    .then((result) => {
      res.send({ data: result, total: result.length });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findByPk(userId)
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

exports.postEditUser = (req, res, next) => {
  const { userId, newName, newEmail } = req.body;

  User.findByPk(userId)
    .then((user) => {
      user.name = newName;
      user.email = newEmail;

      return user.save();
    })
    .then((result) => {
      console.log("user updated");
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteUser = (req, res, next) => {
  const { userId } = req.body;

  User.findByPk(userId)
    .then((user) => {
      return user.destroy();
    })
    .then((result) => {
      console.log("user deleted");
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
