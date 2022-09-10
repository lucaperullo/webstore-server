import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "apps",
  },

  description: {
    type: String,
    required: true,
  },
  apps: [{ type: Schema.Types.ObjectId, ref: "AppElement" }],
});

export default mongoose.model("Apps", appsSchema);
