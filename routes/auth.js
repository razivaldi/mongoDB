const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");

router.post('/signup',[
  body('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .custom((value, {req}) => {
    return User.findOne({email: value})
    .then(userDoc => {
      if (userDoc) {
        return Promise.reject('E-mail address already exists!');
      }
    })
  })
  .normalizeEmail(),

  body('password')
  .trim()
  .isLength({min: 5})
  .withMessage('Please enter a password with at least 5 characters'),

  body('name')
  .trim()
  .not().isEmpty()
], authController.signUp)


router.post('/login',[
  body('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail(),

  body('password')
  .trim()
  .isLength({min: 5})
  .withMessage('Please enter a password with at least 5 characters'),

], authController.login)

module.exports = router