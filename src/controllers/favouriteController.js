const Favourite = require("../models/Favourite");

// - GET - api/favourites # returns all favourites / Private
const allFavs = (req, res) => {
  let favourites = Favourite.find((err, favs) => {
    if (err) {
      res.send(err);
    } else {
      res.send(favs);
    }
  });
};

// - GET - api/favourite/{1} # returns a fav with id 1 / Private
const getFav = (req, res) => {
  Favourite.findById(req.params.id, (err, fav) => {
    if (err) {
      res.send(err);
    } else {
      res.send(fav);
    }
  });
};

// - POST - api/favourite # inserts a new fav into the table / Private
const addFav = (req, res) => {
  Favourite.findOne({ username: req.body.username }, (err, username) => {
    if (err) throw err;
    if (username) {
      return res.status(400).json({ favexists: "Already added to favourites" });
    } else {
      let fav = new Favourite(req.body);
      fav.save(err => {
        if (err) {
          res.send(err);
        } else {
          res.send(fav);
        }
      });
    }
  });
};

// - DELETE - api/favourite/{1} # deletes a fav with id of 1 / Private
const deleteFav = (req, res) => {
  Favourite.deleteOne({ _id: req.params.id }, err => {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully deleted");
    }
  });
};

module.exports = {
  allFavs,
  getFav,
  addFav,
  deleteFav
};
