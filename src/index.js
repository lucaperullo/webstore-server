// initialize node/mongose/express/jwt/express-list-endpoints/multer/cloudinary/multer-storage-cloudinary/cookie-parser/bycryptjs
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import passport from "passport";
import cookieParser from "cookie-parser";
import services from "./services";

const server = express();
const port = process.env.PORT || 3001;

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL || "*"];
const corsOptions = {
  origin: function (origin, next) {
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
server.use("/api", services);

console.log(listEndpoints(server));
server.use(errorHandler);
mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(
    server.listen(port, () => {
      console.log("Server is running on port: ", port);
    })
  );
