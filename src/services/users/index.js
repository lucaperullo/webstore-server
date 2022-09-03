import express from "express";
import bycrypt from "bcrypt";
import { authenticate, verifyJWT, refresh } from "../auth/tools.js";
import UserSchema from "./schema.js";
import { authorize } from "../auth/middleware.js";
import passport from "passport";

import cloudinary from "cloudinary";
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
    next(await errorHandler(error));
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user_byUsername = await UserSchema.findByCredentials(
      username,
      password
    );
    if (user_byUsername) {
      const isMatch = await bycrypt.compare(password, user_byUsername.password);
      if (isMatch) {
        const token = await authenticate(user_byUsername);
        res.cookie("token", token.token, {
          httpOnly: true,
          path: "/",
          sameSite: "none",
          secure: true,
        });
        res
          .cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            path: "/refreshToken",
            sameSite: "none",
            secure: true,
          })
          .send(user_byUsername);
      } else {
        next(await errorHandler("Wrong credentials", "password", 404));
      }
    } else {
      const user_byEmail = await UserSchema.findByCredentials(
        req.body.email,
        password
      );
      if (user_byEmail) {
        const isMatch = await bycrypt.compare(password, user_byEmail.password);
        if (isMatch) {
          const token = await authenticate(user_byEmail);
          res.cookie("token", token.token, {
            httpOnly: true,
            path: "/",
            sameSite: "none",
            secure: true,
          });
          res
            .cookie("refreshToken", token.refreshToken, {
              httpOnly: true,
              path: "/refreshToken",
              sameSite: "none",
              secure: true,
            })
            .send(user_byEmail);
        } else {
          next(await errorHandler("Wrong credentials", "password", 404));
        }
      }
    }
  } catch (error) {
    next(await errorHandler(error));
  }
});

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
usersRouter.get("/me", authorize, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});
usersRouter.post(
  "/pictrue/:id",
  cloudinaryMulter.single("image"),
  async (req, res, next) => {
    try {
      const path = req.file.path;
      let res = await UserSchema.findByIdAndUpdate(
        req.params.id,
        { image: path },
        { new: true }
      );
      res.status(201).send({ res });
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
        path: "/api/users/refreshToken",
      });
      res.status(200).redirect("http://localhost:3000/");
    } catch (error) {
      console.log(error);
      next(await errorHandler(error));
    }
  }
);

export default usersRouter;
