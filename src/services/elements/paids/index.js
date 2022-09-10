import express from "express";
import paidelementSchema from "./schema.js";
import paidsSchema from "../../categories/paid/schema.js";
import { authorize } from "../../auth/middleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../../cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "webStorepaids",
  },
});

const cloudinaryMulter = multer({ storage });

const paidsRouter = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

paidsRouter.post("/:id", authorize, async (req, res, next) => {
  try {
    const newpaid = new paidelementSchema(req.body);
    let paid = await paidsSchema.findById(req.params.id);
    await paidelementSchema.findByIdAndUpdate(
      req.params.id,
      paid.paids.push(newpaid._id)
    );

    paid.save();
    newpaid.save();
    res.status(201).send(newpaid);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});

paidsRouter.post("/multiple/:id", authorize, async (req, res, next) => {
  try {
    const newpaids = req.body.map((paid) => new paidelementSchema(paid));

    let paid = await paidsSchema.findById(req.params.id);

    newpaids.forEach((gam) => paid.paids.push(gam._id));
    paid.save();
    newpaids.forEach((paid) => paid.save());
    res.status(201).send(newpaids);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});

paidsRouter.post(
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

paidsRouter.get("/", async (req, res, next) => {
  try {
    const paids = await paidelementSchema.find();
    res.send(paids);
  } catch (error) {
    next(await errorHandler(error));
  }
});

paidsRouter.get("/:id", async (req, res, next) => {
  try {
    const paid = await paidelementSchema.findById(req.params.id);
    res.send(paid);
  } catch (error) {
    next(await errorHandler(error));
  }
});

paidsRouter.put("/:id", authorize, async (req, res, next) => {
  try {
    const paid = await paidelementSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.send(paid);
  } catch (error) {
    next(await errorHandler(error));
  }
});

paidsRouter.delete("/:id", authorize, async (req, res, next) => {
  try {
    const paid = await paidelementSchema.findByIdAndDelete(req.params.id);
    res.send(paid);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default paidsRouter;
