const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema({
  username: { type: String, required: true },
  label: { type: String, required: true }
});

module.exports = Favourite = mongoose.model("favourite", FavouriteSchema);
