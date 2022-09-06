import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },

  pages: [{ page: { type: Schema.Types.ObjectId, ref: "Page" } }],
});

export default mongoose.model("Category", CategorySchema);
