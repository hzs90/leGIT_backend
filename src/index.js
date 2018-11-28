const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const favouriteController = require("./controllers/favouriteController");
const userController = require("./controllers/userController");

const app = express();
app.set("port", 5000);

app.use(bodyParser.json());

// DB config
const db = require("../config/keys").mongoURI;

// Connect to mongoDB
mongoose.connect(
  db,
  err => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("MongoDB succesfully connected");
    }
  }
);

// Passport middleware
app.use(passport.initialize());
// Passport config
require("../config/passport.js")(passport);

// **************** ROUTES ****************

// Routes - Users
app.get("/api/users", userController.getAllUsers);
app.get("/api/users/current", userController.currentUser);
app.post("/api/users/register", userController.register);
app.post("/api/users/login", userController.login);

// Current user - token authentication
app.get(
  "api/users/current",
  passport.authenticate("jwt", { session: false }),
  userController.currentUser
);

// Routes - Favourites
app.get("/api/favourites", favouriteController.allFavs);
app.get("/api/favourite/:id", favouriteController.getFav);
app.post("/api/favourite", favouriteController.addFav);
app.delete("/api/favourite/:id", favouriteController.deleteFav);

// ************** ROUTES END **************

app.listen(app.get("port"), () => {
  console.log("App is running on localhost: " + app.get("port"));
});
