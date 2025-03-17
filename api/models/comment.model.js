const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    prototype: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prototype", 
      required: true,
    },
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

const Comment = mongoose.model("Comment", schema);

module.exports = Comment;
