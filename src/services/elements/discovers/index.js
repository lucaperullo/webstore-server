import express from "express";
import discoverelementSchema from "./schema.js";
import discoversSchema from "../../categories/discover/schema.js";
import { authorize } from "../../auth/middleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../../cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "webStoreDiscovers",
  },
});

const cloudinaryMulter = multer({ storage });

const discoversRoter = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

discoversRoter.post("/:id", authorize, async (req, res, next) => {
  try {
    const newdiscover = new discoverelementSchema(req.body);
    let disc = await discoversSchema.findById(req.params.id);
    await discoverelementSchema.findByIdAndUpdate(
      req.params.id,
      disc.discoverz.push(newdiscover._id)
    );

    disc.save();

    newdiscover.save();
    res.status(201).send(newdiscover);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});

// post a list of discovers
discoversRoter.post("/multiple/:id", authorize, async (req, res, next) => {
  try {
    // req.body is an array of discovers
    const newdiscovers = req.body.map(
      (discover) => new discoverelementSchema(discover)
    );
    let disc = await discoversSchema.findById(req.params.id);

    newdiscovers.forEach((discover) => disc.discoverz.push(discover._id));
    disc.save();
    // save the discovers
    newdiscovers.forEach((discover) => discover.save());
    res.status(201).send(newdiscovers);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});

discoversRoter.post(
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

discoversRoter.get("/", async (req, res, next) => {
  try {
    const discovers = await discoverelementSchema.find();
    res.send(discovers);
  } catch (error) {
    next(await errorHandler(error));
  }
});

discoversRoter.get("/:id", async (req, res, next) => {
  try {
    const discover = await discoverelementSchema.findById(req.params.id);
    res.send(discover);
  } catch (error) {
    next(await errorHandler(error));
  }
});

discoversRoter.put("/:id", authorize, async (req, res, next) => {
  try {
    const discover = await discoverelementSchema.findByIdAndUpdate(
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

discoversRoter.delete("/:id", authorize, async (req, res, next) => {
  try {
    const discover = await discoverelementSchema.findByIdAndDelete(
      req.params.id
    );
    res.send(discover);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default discoversRoter;
