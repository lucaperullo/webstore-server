import express from "express";
import gameSchema from "./schema.js";
import gamesSchema from "../../categories/games/schema.js";
import { authorize } from "../../auth/middleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../../cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "webStoreGames",
  },
});

const cloudinaryMulter = multer({ storage });

const gamesRouter = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

gamesRouter.post("/:id", authorize, async (req, res, next) => {
  try {
    const newgame = new gameSchema(req.body);
    let ap = await gamesSchema.findById(req.params.id);
    let game = gameSchema.findByIdAndUpdate(
      req.params.id,
      ap.games.push(newgame._id)
    );

    game.save();
    newgame.save();
    res.status(201).send(newgame);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});

gamesRouter.post(
  "/picture",
  cloudinaryMulter.single("image"),
  async (req, res, next) => {
    try {
      const path = req.file.path;
      res.status(201).send({ path });
    } catch (error) {
      next(await errorHandler(error));
    }
  }
);

gamesRouter.get("/", async (req, res, next) => {
  try {
    const games = await gameSchema.find();
    res.send(games);
  } catch (error) {
    next(await errorHandler(error));
  }
});

gamesRouter.get("/:id", async (req, res, next) => {
  try {
    const game = await gameSchema.findById(req.params.id);
    res.send(game);
  } catch (error) {
    next(await errorHandler(error));
  }
});

gamesRouter.put("/:id", authorize, async (req, res, next) => {
  try {
    const game = await gameSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(game);
  } catch (error) {
    next(await errorHandler(error));
  }
});

gamesRouter.delete("/:id", authorize, async (req, res, next) => {
  try {
    const game = await gameSchema.findByIdAndDelete(req.params.id);
    res.send(game);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default gamesRouter;
