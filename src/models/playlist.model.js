import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      Type: String,
      required: true,
    },
    description: {
      Type: String,
      required: true,
    },
    videos: [
      {
        Type: Schema.Types.ObjectId,
        ref: "video",
      },
    ],
    ower: {
      Type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const PlayList = mongoose.model("PlayList", playlistSchema);
