const moongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new moongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email :" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password :" + value);
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      validate: {
        validator: function (v) {
          return ["male", "female", "other"].includes(v);
        },
        message: (props) => `${props.value} is not a valid gender`,
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL :" + value);
        }
      },
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    },
    about: {
      type: String,
      default: "Hey there! I am using Dev Tinder",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.getPasswordMathched = async function (passwordbyUserInput) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(
    passwordbyUserInput,
    user.password
  );
  return isPasswordMatch;
};
module.exports = moongoose.model("users", userSchema);
