import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gamesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },
  games: [{ type: Schema.Types.ObjectId, ref: "GameElement" }],
});

export default mongoose.model("Games", gamesSchema);
