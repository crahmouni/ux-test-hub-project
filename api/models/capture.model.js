
const mongoose = require("mongoose");

const captureSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    originalUrl: {
      type: String, 
      required: false,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", 
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        ret.id = doc.id;
        return ret;
      },
    },
  }
);

const Capture = mongoose.model("Capture", captureSchema);

module.exports = Capture;
