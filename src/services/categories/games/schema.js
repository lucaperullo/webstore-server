import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
});

export default mongoose.model("Games", gameSchema);
