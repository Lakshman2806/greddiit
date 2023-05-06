const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const greddiitsSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Tags: {
      type: [String],
      required: true,
    },
    Banned_Keywords: {
      type: [String],
      required: true,
    },
    Created_By: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Should log the time when the user joined the subgreddit
    Joined_Users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Joined_Users_Time: [
      {
        type: Date,
        default: Date.now(),
      },
    ],
    Pending_Users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Blocked_Users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Rejected_Users: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        time: {
          type: Date,
          default: Date.now(),
        },
      },
      // {
      //   type : Array ,
      //   "default" : []
      // }
    ],
    Left_Users: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        time: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    NoOfVisits: [
      {
        type: Date,
        default: Date.now(),
      },
    ],
    NoOfReports: {
      type: Number,
      default: 0,
    },
    NoOfDeletedPosts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subgreddiit", greddiitsSchema);
