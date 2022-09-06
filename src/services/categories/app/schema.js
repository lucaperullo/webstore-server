import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },
  apps: [{ type: Schema.Types.ObjectId, ref: "App" }],
});

export default mongoose.model("Apps", appSchema);
