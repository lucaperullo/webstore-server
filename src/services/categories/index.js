import express from "express";
import { authorize } from "../auth/middleware.js";
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
    const newCategory = new categorySchema(req.body);
    res.status(201).send(newCategory);
  } catch (error) {
    next(await errorHandler(error));
  }
});

categoriesRouter.get("/", authorize, async (req, res, next) => {
  try {
    const categories = await categorySchema.find();
    res.send(categories);
  } catch (error) {
    next(await errorHandler(error));
  }
});

categoriesRouter.get("/:id", authorize, async (req, res, next) => {
  try {
    const category = await categorySchema.findById(req.params.id);
    res.send(category);
  } catch (error) {
    next(await errorHandler(error));
  }
});

categoriesRouter.put("/:id", authorize, async (req, res, next) => {
  try {
    const category = await categorySchema.findByIdAndUpdate(
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
    const category = await categorySchema.findByIdAndDelete(req.params.id);
    res.send(category);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default categoriesRouter;
