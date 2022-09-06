import express from "express";
import { authorize } from "../../auth/middleware.js";
import discoversSchema from "./schema.js";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../../cloudinary.js";

const discoversRoutes = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

discoversRoutes.post("/", authorize, async (req, res, next) => {
  try {
    const newdiscover = new discoversSchema(req.body);
    newdiscover.save();
    res.status(201).send(newdiscover);
  } catch (error) {
    next(await errorHandler(error));
  }
});

discoversRoutes.get("/", async (req, res, next) => {
  try {
    // populate the categories with the pages
    let populatedCategories = await discoversSchema
      .find()
      .populate("discoverz");

    res.send(populatedCategories);
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
    next(await errorHandler(error));
  }
});

discoversRoutes.get("/:id", async (req, res, next) => {
  try {
    const discover = await discoversSchema.findById(req.params.id);
    res.send(discover);
  } catch (error) {
    next(await errorHandler(error));
  }
});

discoversRoutes.put("/:id", authorize, async (req, res, next) => {
  try {
    const discover = await discoversSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.send(discover);
  } catch (error) {
    next(await errorHandler(error));
  }
});

discoversRoutes.delete("/:id", authorize, async (req, res, next) => {
  try {
    const discover = await discoversSchema.findByIdAndDelete(req.params.id);
    res.send(discover);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default discoversRoutes;
