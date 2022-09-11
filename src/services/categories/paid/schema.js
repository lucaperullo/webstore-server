import mongoose from "mongoose";

const Schema = mongoose.Schema;

const paidsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "paids",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  description: {
    type: String,
    required: true,
  },
  paids: [{ type: Schema.Types.ObjectId, ref: "PaidElement" }],
});

export default mongoose.model("Paids", paidsSchema);
