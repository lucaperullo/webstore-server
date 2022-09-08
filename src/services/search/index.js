import express from "express";
import appelementSchema from "../elements/apps/schema.js";
import appsSchema from "../categories/app/schema.js";
import discoverelementSchema from "../elements/discovers/schema.js";
import discoversSchema from "../categories/discover/schema.js";
import gameelementSchema from "../elements/games/schema.js";
import gamesSchema from "../categories/games/schema.js";

const searchRouter = express.Router();

searchRouter.get("/:query", async (req, res, next) => {
  try {
    let searchArray = [];
    const appelements = await appelementSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const discoverelements = await discoverelementSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const gameelements = await gameelementSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const apps = await appsSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const discovers = await discoversSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const games = await gamesSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    searchArray.push(
      appelements,
      discoverelements,
      gameelements,
      apps,
      discovers,
      games
    );
    res.send(searchArray.reduce((acc, curr) => acc.concat(curr), []));
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
    next(error);
  }
});

export default searchRouter;
