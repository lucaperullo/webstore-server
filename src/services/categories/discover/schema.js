import mongoose from "mongoose";

const Schema = mongoose.Schema;

const discoversSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },
  discoverz: [{ type: Schema.Types.ObjectId, ref: "DiscoverElement" }],
});

export default mongoose.model("Discovers", discoversSchema);
