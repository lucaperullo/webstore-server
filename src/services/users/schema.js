import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "validator";

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    surname: {
      type: String,
      required: [true, "Please tell us your surname!"],
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/webstoreclouds/image/upload/v1662301700/webStore/user1_jjaas5.svg",
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:
          "AppElement" ||
          "GameElement" ||
          "DiscoverElement" ||
          "PaidElement" ||
          "Games" ||
          "Apps" ||
          "Discovers" ||
          "Paids",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshTokens: [{ token: { type: String } }],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  user.role = "user";

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  if (user.isModified("password")) {
    user.password = hash;
  }
  next();
});

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    console.log(user, password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return null;
  } else {
    return null;
  }
};
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.__v;
  delete userObject.refreshTokens;
  delete userObject.createdAt;
  if (userObject.googleId === "") delete userObject.googleId;
  if (userObject.facebookId === "") delete userObject.facebookId;
  return userObject;
};
export default mongoose.model("User", UserSchema);
