import express from "express";
import { authorize } from "../../auth/middleware.js";
import paidsSchema from "./schema.js";

const paidsRoutes = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

paidsRoutes.post("/", authorize, async (req, res, next) => {
  try {
    const newpaid = new paidsSchema(req.body);
    newpaid.save();
    res.status(201).send(newpaid);
  } catch (error) {
    next(await errorHandler(error));
  }
});

paidsRoutes.get("/", async (req, res, next) => {
  try {
    // populate the categories with the pages
    let populatedCategories = await paidsSchema.find().populate("paids");

    res.send(populatedCategories);
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
    next(await errorHandler(error));
  }
});

paidsRoutes.get("/:id", async (req, res, next) => {
  try {
    const paid = await paidsSchema.findById(req.params.id).populate("paids");
    res.send(paid);
  } catch (error) {
    next(await errorHandler(error));
  }
});

paidsRoutes.put("/:id", authorize, async (req, res, next) => {
  try {
    const paid = await paidsSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(paid);
  } catch (error) {
    next(await errorHandler(error));
  }
});

paidsRoutes.delete("/:id", authorize, async (req, res, next) => {
  try {
    // const paid = await paidsSchema.findByIdAndDelete(req.params.id);
    const paidsFromCategory = await paidelementSchema.find({
      paid: req.params.id,
    });
    paidsFromCategory.forEach(async (paid) => {
      const gam = await paidelementSchema.findByIdAndDelete(paid._id);
      gam.save();
    });
    const paid = await paidsSchema.findByIdAndDelete(req.params.id);
    paid.save();
    res.send(paid);
  } catch (error) {
    next(await errorHandler(error));
  }
});
export default paidsRoutes;
