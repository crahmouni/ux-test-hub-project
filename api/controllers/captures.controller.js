const Capture = require("../models/capture.model");

module.exports.list = (req, res, next) => {
  Capture.find()
    .sort({ createdAt: -1 }) 
    .then((captures) => res.json(captures))
    .catch(next);
};
