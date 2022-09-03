import { Schema, model } from "mongoose";
import bycrypt from "bycrypt";
import crypto from "crypto";
import validator from "validator";

const userSchema = new Schema(
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
        "https://res.cloudinary.com/dwx0x1pe9/image/upload/v1614858356/user_u6gubg.jpg",
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
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    refreshTokens: [{ token: { type: String } }],
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (user) {
    const isMatch = await bycrypt.compare(password, user.password);
    if (isMatch) return user;
    else return null;
  } else return null;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;
  delete userObject.refreshTokens;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.createdAt;
  if (userObject.googleId === "") delete userObject.googleId;
  if (userObject.facebookId === "") delete userObject.facebookId;
  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;
  user.role = "user";

  if (!user.password) {
    user.password = crypto.randomBytes(12).toString("hex");
  }
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});
userSchema.pre("findOneAndUpdate", async function (next) {
  const user = this.getUpdate();

  const current = await UserSchema.findOne({ username: user.username });
  if (user.password) {
    const isMatch = await bcrypt.compare(user.password, current.password);
    if (!isMatch) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
});

export default model("User", userSchema);
