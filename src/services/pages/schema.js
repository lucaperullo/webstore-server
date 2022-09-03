import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    content: {
      type: String,
      required: [true, "Please provide a content"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories", // this is the name of the model
      required: [true, "Please provide a category"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("pages", pageSchema);
