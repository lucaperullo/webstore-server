import express from "express";
import { authorize } from "../../auth/middleware.js";
import gamesSchema from "./schema.js";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../../cloudinary.js";

const gamesRoutes = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

gamesRoutes.post("/", authorize, async (req, res, next) => {
  try {
    const newgame = new gamesSchema(req.body);
    newgame.save();
    res.status(201).send(newgame);
  } catch (error) {
    next(await errorHandler(error));
  }
});

gamesRoutes.get("/", async (req, res, next) => {
  try {
    // populate the categories with the pages
    let populatedCategories = await gamesSchema.find().populate("games");

    res.send(populatedCategories);
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
    next(await errorHandler(error));
  }
});

gamesRoutes.get("/:id", async (req, res, next) => {
  try {
    const game = await gamesSchema.findById(req.params.id);
    res.send(game);
  } catch (error) {
    next(await errorHandler(error));
  }
});

gamesRoutes.put("/:id", authorize, async (req, res, next) => {
  try {
    const game = await gamesSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(game);
  } catch (error) {
    next(await errorHandler(error));
  }
});

gamesRoutes.delete("/:id", authorize, async (req, res, next) => {
  try {
    const game = await gamesSchema.findByIdAndDelete(req.params.id);
    res.send(game);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default gamesRoutes;
