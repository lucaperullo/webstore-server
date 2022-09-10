import mongoose from "mongoose";

const gameelementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a title"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a content"],
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/webstoreclouds/image/upload/v1662473365/webStore/ios-application-placeholder_n0ipc1.png",
      unique: true,
    },
    url: {
      type: String,
      required: [true, "Please provide a link"],
    },
    path: {
      type: String,
      default: "games",
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Games", // this is the name of the model
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

export default mongoose.model("GameElement", gameelementSchema);
