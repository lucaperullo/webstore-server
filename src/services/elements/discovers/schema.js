import mongoose from "mongoose";

const discoverelementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a title"],
    },
    description: {
      type: String,
      required: [true, "Please provide a content"],
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/webstoreclouds/image/upload/v1662473365/webStore/ios-application-placeholder_n0ipc1.png",
    },
    url: {
      type: String,
      required: [true, "Please provide a link"],
    },
    path: {
      type: String,
      default: "discover",
    },
    discover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discovers", // this is the name of the model
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

export default mongoose.model("DiscoverElement", discoverelementSchema);
