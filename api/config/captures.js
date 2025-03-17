const express = require("express");
const Capture = require("../models/capture.model");
const Comment = require("../models/comment.model");
const router = express.Router();


router.post("/captures/:captureId/comments", async (req, res) => {
  try {
    const { captureId } = req.params;
    const { text, user } = req.body;

    const newComment = new Comment({
      text,
      user,
      capture: captureId,
    });

    await newComment.save();

    const capture = await Capture.findById(captureId);
    capture.comments.push(newComment);
    await capture.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
