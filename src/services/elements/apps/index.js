import express from "express";
import appelementSchema from "./schema.js";
import appsSchema from "../../categories/app/schema.js";
import { authorize } from "../../auth/middleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../../cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "webStoreApps",
  },
});

const cloudinaryMulter = multer({ storage });

const appsRouter = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

appsRouter.post("/:id", authorize, async (req, res, next) => {
  try {
    const newApp = new appelementSchema(req.body);
    let app = await appsSchema.findById(req.params.id);
    await appsSchema.findByIdAndUpdate(req.params.id, ap.apps.push(newApp._id));

    app.save();
    newApp.save();
    res.status(201).send(newApp);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});

appsRouter.post("/multiple/:id", authorize, async (req, res, next) => {
  try {
    let app = await appsSchema.findById(req.params.id);

    await req.body.map(async (ap) => {
      let a = new appelementSchema(ap);
      app.apps.push(a._id);
      a.set({ app: app._id });
      console.log(a);
      await a.save();
    });

    app.save();

    res.status(201).send(app);
  } catch (error) {
    console.log(error);
    next(await errorHandler(error));
  }
});

appsRouter.post(
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

appsRouter.get("/", async (req, res, next) => {
  try {
    const Apps = await appelementSchema.find();
    res.send(Apps);
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRouter.get("/:id", async (req, res, next) => {
  try {
    const App = await appelementSchema.findById(req.params.id);
    res.send(App);
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRouter.put("/:id", authorize, async (req, res, next) => {
  try {
    const App = await appelementSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.send(App);
  } catch (error) {
    next(await errorHandler(error));
  }
});

appsRouter.delete("/:id", authorize, async (req, res, next) => {
  try {
    const App = await appelementSchema.findByIdAndDelete(req.params.id);
    res.send(App);
  } catch (error) {
    next(await errorHandler(error));
  }
});

export default appsRouter;
