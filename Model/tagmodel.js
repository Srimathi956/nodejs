const mongoose = require("mongoose");
const tagschema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },
  description: { type: String, unique: true },
});

const tagmodel = mongoose.model("Tags", tagschema);
module.exports = tagmodel;
