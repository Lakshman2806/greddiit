const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  First_name: {
    type: String,
    required: true,
  },
  Last_name: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Age: {
    type: Number,
    required: true,
  },
  Contact_number: {
    type: Number,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  Followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  MySubgreddiits: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subgreddiit",
    },
  ],
  Saved_Posts : {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      }
    ],
    default: []
  }

});

//static method to sign up
userSchema.statics.signUp = async function (
  First_name,
  Last_name,
  Username,
  Email,
  Age,
  Contact_number,
  Password
) {
  if (
    !First_name ||
    !Last_name ||
    !Username ||
    !Email ||
    !Age ||
    !Contact_number ||
    !Password
  ) {
    throw Error("All fields are required");
  }

  if (!validator.isEmail(Email)) {
    throw Error("Invalid Email");
  }

  if (!validator.isStrongPassword(Password)) {
    throw Error(
      "Password is not strong enough (\n" +
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol)"
    );
  }

  const exists = await this.findOne({ Email });
  if (exists) {
    throw Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(Password, salt);

  const newUser = await this.create({
    First_name,
    Last_name,
    Username,
    Email,
    Age,
    Contact_number,
    Password: hash,
  });

  return newUser;
};

//static method to login
userSchema.statics.login = async function (Email, Password) {
  if (!Email || !Password) {
    throw Error("All fields are required");
  }

  const user = await this.findOne({ Email });

  if (!user) {
    throw Error("Incorrect email :(");
  }

  const isMatch = await bcrypt.compare(Password, user.Password);

  if (!isMatch) {
    throw Error("Incorrect password :(");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
