import { Schema, model } from "mongoose";

const pageSchema = new Schema(
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
      type: Schema.Types.ObjectId,
      ref: "categories", // this is the name of the model
      required: [true, "Please provide a category"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    reviews: [
      {
        reviewer: Schema.Types.ObjectId,
        review: String,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("pages", pageSchema);
