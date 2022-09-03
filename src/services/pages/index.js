import express from "express";
import mongoose from "mongoose";
import pageSchema from "./schema.js";
import { authorize } from "../auth/middleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "webStore",
  },
});

const cloudinaryMulter = multer({ storage });

const pageRouter = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

pageRouter.post("/", authorize, async (req, res, next) => {
  try {
    const newPage = new pageSchema(req.body);

    res.status(201).send(newPage);
  } catch (error) {
    next(await errorHandler(error));
  }
});

pageRouter.post(
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

pageRouter.get("/", authorize, async (req, res, next) => {
  try {
    const pages = await pageSchema.find();
    res.send(pages);
  } catch (error) {
    next(await errorHandler(error));
  }
});

pageRouter.get("/:id", authorize, async (req, res, next) => {
  try {
    const page = await pageSchema.findById(req.params.id);
    res.send(page);
  } catch (error) {
    next(await errorHandler(error));
  }
});

pageRouter.put("/:id", authorize, async (req, res, next) => {
  try {
    const page = await pageSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(page);
  } catch (error) {
    next(await errorHandler(error));
  }
});

pageRouter.delete("/:id", authorize, async (req, res, next) => {
  try {
    const page = await pageSchema.findByIdAndDelete(req.params.id);
    res.send(page);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default pageRouter;
