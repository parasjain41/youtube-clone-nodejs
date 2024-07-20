import mongoose, { Schema } from "mongoose";

const likeSchemna = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "tweet",
    },
    likeby: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    
  },
  {
    timestamps: true,
  }
);

export const Like = mongoose.model("Like",likeSchemna)