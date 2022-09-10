import express from "express";
import appelementSchema from "../elements/apps/schema.js";
import appsSchema from "../categories/app/schema.js";
import discoverelementSchema from "../elements/discovers/schema.js";
import paidsSchema from "../categories/paid/schema.js";
import paidelementSchema from "../elements/paids/schema.js";
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
    const paidelements = await paidelementSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const paid = await paidsSchema.find({
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
      paidelements,
      paid,
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

searchRouter.post("/:query/price", async (req, res, next) => {
  try {
    const searchArray = [];
    //  sort the results by price in ascending order if req.body is true and descending if false
    const paidelements = await paidelementSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const appelements = await appelementSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const discoverelements = await discoverelementSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });
    const gameelements = await gameelementSchema.find({
      name: { $regex: req.params.query, $options: "i" },
    });

    const paid = await paidsSchema.find({
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

    if (req.body.priceHightoLow === true) {
      paidelements.sort(
        (a, b) => parseInt(a.price.slice(1)) - parseInt(b.price.slice(1))
      );
    } else if (req.body.priceHightoLow === false) {
      paidelements.sort(
        //
        (a, b) => parseInt(b.price.slice(1)) - parseInt(a.price.slice(1))
      );
    }
    searchArray.push(appelements, discoverelements, gameelements, paidelements);
    res.send(
      searchArray.reduce(
        (acc, curr) =>
          acc.concat(curr).sort(
            // elements with a price first
            (a, b) => (a.price ? -1 : 1)
          ),
        []
      )
    );
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
    next(error);
  }
});

export default searchRouter;
