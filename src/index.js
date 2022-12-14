// initialize node/mongose/express/jwt/express-list-endpoints/multer/cloudinary/multer-storage-cloudinary/cookie-parser/bycryptjs
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import passport from "passport";
import cookieParser from "cookie-parser";
import usersRouter from "./services/users/index.js";
import appsRoutes from "./services/categories/app/index.js";
import gamesRoutes from "./services/categories/games/index.js";
import discoversRoutes from "./services/categories/discover/index.js";
import appsRouter from "./services/elements/apps/index.js";
import gamesRouter from "./services/elements/games/index.js";
import discoversRouter from "./services/elements/discovers/index.js";
import searchRouter from "./services/search/index.js";
import paidsRoutes from "./services/categories/paid/index.js";
import paidsRouter from "./services/elements/paids/index.js";
import { fileURLToPath } from 'url';

import path,{ dirname } from "path";
const server = express();
const port = process.env.PORT || 3001;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const whitelist = [
  "https://webstorecloud.vercel.app",
  "https://www.webstorecloud.it",
  undefined,
  "http://localhost:5173",
];
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
server.use("/category/apps", appsRoutes);
server.use("/category/games", gamesRoutes);
server.use("/category/discover", discoversRoutes);
server.use("/category/paid", paidsRoutes);
server.use("/elements/apps", appsRouter);
server.use("/elements/games", gamesRouter);
server.use("/elements/discover", discoversRouter);
server.use("/elements/paid", paidsRouter);
server.use("/search", searchRouter);
server.get("/",(req, res) => {

  res.sendFile(path.join(__dirname, "/public/index.html"));
});
//


console.table(listEndpoints(server));
// server.use(errorHandler);
mongoose.connect(process.env.MONGO_CONNECT).then(
  server.listen(port, () => {
    console.log("Server is flying on port: ", port);
  })
);
