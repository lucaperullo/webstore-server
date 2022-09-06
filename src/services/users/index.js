import express from "express";
import bcrypt from "bcrypt";
import { authenticate, verifyJWT, refresh } from "../auth/tools.js";
import UserSchema from "./schema.js";
import { authorize } from "../auth/middleware.js";
import passport from "passport";

import cloudinary from "../../cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "webStore",
  },
});
const cloudinaryMulter = multer({ storage });

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserSchema(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});
// tested
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await UserSchema.findByCredentials(email, password);
    console.log(user);
    if (user) {
      const tokens = await authenticate(user);
      res.cookie("accessToken", tokens.token, {
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        secure: process.env.NODE_ENV === "production" ? true : false,
      });
      res
        .cookie("refreshToken", tokens.refreshToken, {
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          secure: process.env.NODE_ENV === "production" ? true : false,
        })
        .status(200)
        .send({ message: "login successful", user });
    } else {
      res.status(404).send({ message: "login failed" });
    }
  } catch (error) {
    res.send({ message: error });
    next(error);
  }
});
// tested
usersRouter.get("/refreshToken", async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const newTokens = await refresh(oldRefreshToken);
    res.cookie("token", newTokens.token, {
      httpOnly: true,
    });
    res
      .cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        path: "/api/users/refreshToken",
      })
      .send("ok");
  } catch (error) {
    next(await errorHandler(error));
  }
});
// tested
usersRouter.get("/me", authorize, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});
usersRouter.post(
  "/picture/:id",
  cloudinaryMulter.single("image"),
  async (req, res, next) => {
    try {
      console.log(req);
      const path = req.file.path;
      let resp = await UserSchema.findByIdAndUpdate(
        req.params.id,
        { image: path },
        { new: true }
      );
      res.status(201).send({ resp });
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.put("/updateInfo", authorize, async (req, res, next) => {
  try {
    const user = await UserSchema.findOneAndUpdate(
      { _id: req.user._id },
      { ...req.body }
    );
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
usersRouter.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

usersRouter.get(
  "/facebookRedirect",
  passport.authenticate("facebook"),
  async (req, res, next) => {
    try {
      res.cookie("token", req.user.tokens.token, {
        httpOnly: true,
      });
      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        path: "/users/refreshToken",
      });
      res.status(200).redirect(process.env.CLI_URL);
    } catch (error) {
      console.log(error);
      next(await errorHandler(error));
    }
  }
);

export default usersRouter;
