// initialize node/mongose/express/jwt/express-list-endpoints/multer/cloudinary/multer-storage-cloudinary/cookie-parser/bycryptjs
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import passport from "passport";
import cookieParser from "cookie-parser";

import usersRouter from "./services/users/index.js";
import pageRouter from "./services/pages/index.js";
import categoriesRouter from "./services/categories/index.js";
const server = express();
const port = process.env.PORT || 3001;

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const whitelist = ["https://webstorecloud.vercel.app", "*", undefined];
const corsOptions = {
  origin: function (origin, next) {
    console.log("ORIGIN --> ", origin);
    if (whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("NOT ALLOWED - CORS ISSUES"));
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));
server.use(express.json());
server.use(loggerMiddleware);
server.use(cookieParser());
server.use(passport.initialize());
server.use("/users", usersRouter);
server.use("/pages", pageRouter);
server.use("/categories", categoriesRouter);

console.table(listEndpoints(server));
// server.use(errorHandler);
mongoose.connect(process.env.MONGO_CONNECT).then(
  server.listen(port, () => {
    console.log("Server is running on port: ", port);
  })
);
