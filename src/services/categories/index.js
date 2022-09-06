import express from "express";
import { authorize } from "../auth/middleware.js";
import CategorySchema from "./schema.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../cloudinary.js";

const categoriesRouter = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

categoriesRouter.post("/", authorize, async (req, res, next) => {
  try {
    const newCategory = new CategorySchema(req.body);
    newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    next(await errorHandler(error));
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    // populate the categories with the pages
    let populatedCategories = await CategorySchema.find().populate("pages");

    res.send(populatedCategories);
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
    next(await errorHandler(error));
  }
});

categoriesRouter.get("/:id", async (req, res, next) => {
  try {
    const category = await CategorySchema.findById(req.params.id);
    res.send(category);
  } catch (error) {
    next(await errorHandler(error));
  }
});

categoriesRouter.put("/:id", authorize, async (req, res, next) => {
  try {
    const category = await CategorySchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.send(category);
  } catch (error) {
    next(await errorHandler(error));
  }
});

categoriesRouter.delete("/:id", authorize, async (req, res, next) => {
  try {
    const category = await CategorySchema.findByIdAndDelete(req.params.id);
    res.send(category);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default categoriesRouter;
