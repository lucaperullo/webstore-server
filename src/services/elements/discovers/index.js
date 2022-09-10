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

const discoverRouter = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

discoverRouter.post("/:id", authorize, async (req, res, next) => {
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
discoverRouter.post("/multiple/:id", authorize, async (req, res, next) => {
  try {
    let discover = await discoversSchema.findById(req.params.id);

    await req.body.map(async (dis) => {
      let d = new discoverelementSchema(dis);
      discover.discoverz.push(d._id);
      d.set({ discover: discover._id });
      console.log(d);
      await d.save();
    });

    discover.save();

    res.status(201).send(discover);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});

discoverRouter.post(
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

discoverRouter.get("/", async (req, res, next) => {
  try {
    const discovers = await discoverelementSchema.find();
    res.send(discovers);
  } catch (error) {
    next(await errorHandler(error));
  }
});

discoverRouter.get("/:id", async (req, res, next) => {
  try {
    const discover = await discoverelementSchema.findById(req.params.id);
    res.send(discover);
  } catch (error) {
    next(await errorHandler(error));
  }
});

discoverRouter.put("/:id", authorize, async (req, res, next) => {
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

discoverRouter.delete("/:id", authorize, async (req, res, next) => {
  try {
    const discover = await discoverelementSchema.findByIdAndDelete(
      req.params.id
    );
    res.send(discover);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default discoverRouter;
