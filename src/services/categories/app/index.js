import express from "express";
import { authorize } from "../../auth/middleware.js";
import appSchema from "./schema.js";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../../cloudinary.js";

const appsRoutes = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

appsRoutes.post("/", authorize, async (req, res, next) => {
  try {
    const newapp = new appSchema(req.body);
    newapp.save();
    res.status(201).send(newapp);
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRoutes.get("/", async (req, res, next) => {
  try {
    // populate the categories with the pages
    let populatedCategories = await appSchema.find().populate("pages");

    res.send(populatedCategories);
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
    next(await errorHandler(error));
  }
});

appsRoutes.get("/:id", async (req, res, next) => {
  try {
    const app = await appSchema.findById(req.params.id);
    res.send(app);
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRoutes.put("/:id", authorize, async (req, res, next) => {
  try {
    const app = await appSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(app);
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRoutes.delete("/:id", authorize, async (req, res, next) => {
  try {
    const app = await appSchema.findByIdAndDelete(req.params.id);
    res.send(app);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default appsRoutes;
