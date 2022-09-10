import mongoose from "mongoose";

const Schema = mongoose.Schema;

const discoversSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "discover",
  },
  description: {
    type: String,
    required: true,
  },
  discoverz: [{ type: Schema.Types.ObjectId, ref: "DiscoverElement" }],
});

export default mongoose.model("Discovers", discoversSchema);
