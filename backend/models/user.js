const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required"
  },
  password: {
    type: String
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);