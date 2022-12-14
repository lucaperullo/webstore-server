import express from "express";
import { authorize } from "../../auth/middleware.js";
import appsSchema from "./schema.js";
import appelementSchema from "../../elements/apps/schema.js";

const appsRoutes = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

appsRoutes.post("/", authorize, async (req, res, next) => {
  try {
    const newapp = new appsSchema(req.body);
    newapp.save();
    res.status(201).send(newapp);
    s;
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRoutes.get("/", async (req, res, next) => {
  try {
    // populate the categories with the pages
    let populatedCategories = await appsSchema.find().populate("apps");

    res.send(populatedCategories);
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
    next(await errorHandler(error));
  }
});

appsRoutes.get("/:id", async (req, res, next) => {
  try {
    const app = await appsSchema.findById(req.params.id).populate("apps");
    res.send(app);
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRoutes.put("/:id", authorize, async (req, res, next) => {
  try {
    const app = await appsSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(app);
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRoutes.delete("/:id", authorize, async (req, res, next) => {
  try {
    // const app = await appsSchema.findByIdAndDelete(req.params.id);
    const appsFromCategory = await appelementSchema.find({
      app: req.params.id,
    });
    appsFromCategory.forEach(async (app) => {
      const ap = await appelementSchema.findByIdAndDelete(app._id);
      ap.save();
    });
    const app = await appsSchema.findByIdAndDelete(req.params.id);
    app.save();
    res.send(app);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default appsRoutes;
