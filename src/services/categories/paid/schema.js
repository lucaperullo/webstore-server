import mongoose from "mongoose";

const Schema = mongoose.Schema;

const paidsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    default: "paids",
  },
  description: {
    type: String,
    required: true,
  },
  paids: [{ type: Schema.Types.ObjectId, ref: "PaidElement" }],
});

export default mongoose.model("Paids", paidsSchema);
