import { Router } from "express";
import pagesRouter from "./pages";
import usersRouter from "./users";
import categoriesRouter from "./categories";

Router.use("/pages", pagesRouter);
Router.use("/users", usersRouter);
Router.use("/categories", categoriesRouter);

export default Router;
