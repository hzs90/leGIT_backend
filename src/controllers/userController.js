const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Load Input validation
const validateRegisterInput = require("../../src/validation/register");
const validateLoginInput = require("../../src/validation/login");

// - GET - api/users # returns all users / Public
const getAllUsers = (req, res) => res.json({ msg: "Users works" });

// - POST - api/users/register # returns all users / Public
const register = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
};

// - POST - api/users/login # returns all users / Public
const login = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        const payload = { id: user.id, name: user.name }; // Create JWT payload
        const keys = require("../../config/keys");
        // Sign the token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 10000 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ invalidpassword: "Password incorrect" });
      }
    });
  });
};

// - GET - api/users/current # returns current user / Private
const currentUser = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};

module.exports = {
  getAllUsers,
  register,
  login,
  currentUser
};
