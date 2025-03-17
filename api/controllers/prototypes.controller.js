const createError = require("http-errors");
const Prototype = require("../models/prototype.model");
const Comment = require("../models/comment.model");
const mailer = require("../config/mailer.config");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Capture = require("../models/capture.model");

module.exports.list = (req, res, next) => {
  const { 
    limit = 5, 
    page = 0, 
    sort = 'startDate', 
    city, 
    title, 
    userId, 
    startDate, 
    endDate,
    radius = 5000,
    lat,
    lng
   } = req.query;

  if (Number.isNaN(Number(limit)) || Number(limit) <= 0) {
    return next(createError(400, { message: 'Invalid query parameter', errors: { limit: 'Must be >= 0' }}));
  }
  if (Number.isNaN(Number(page)) || Number(page) < 0) {
    return next(createError(400, { message: 'Invalid query parameter', errors: { page: 'Must be >= 0' } }));
  }

  const criterial = {};
  if (title) criterial.title = new RegExp(title, 'i'); 
  
  if (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(createError(400, { message: "Invalid userId format" }));
    }
    criterial.user = new mongoose.Types.ObjectId(userId); 
  }

  if (startDate || endDate) {
    criterial.startDate = {};
    if (startDate) criterial.startDate.$gte = new Date(startDate); 
    if (endDate) criterial.startDate.$lte = new Date(endDate); 
  }
 
  if (city) criterial['address.city'] = city;
 
  if (lat && lng) {
    if (Number.isNaN(Number(lat)) || !(Number(lat) >= -90 && Number(lat) <= 90)) {
      return next(createError(400, { message: 'Invalid lat parameter', errors: { lat: 'Must be -90 >= lat <= 90' } }));
    }
    if (Number.isNaN(Number(lng)) || !(Number(lng) >= -180 && Number(lng) <= 180)) {
      return next(createError(400, { message: 'Invalid lat parameter', errors: { lng: 'Must be -180 >= lat <= 180' } }));
    }
    criterial['address.location'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)]
       },
      $maxDistance: Number(radius),
      $minDistance: 0
     }
    }
  }

  const sortCriterial = sort === "comments" ? { comments: -1 } : { [sort]: 'desc' };

  Prototype.find(criterial)
    .sort(sortCriterial)
    .limit(limit)
    .skip(limit * page)
    .populate("user")
    .populate("comments") 
    .then((prototypes) => res.json(prototypes))
    .catch((error) => next(error));
};

module.exports.create = (req, res, next) => {
  try {
    const prototypeData = req.body;

    if (!prototypeData.title || !prototypeData.startDate || !prototypeData.endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (prototypeData.address?.location) {
      const { lat, lng } = prototypeData.address.location || {};
      if (!lat || !lng) {
        return res.status(400).json({ message: "Coordinates must be valid numbers" });
      }
      prototypeData.address.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }

    if (prototypeData.screenshot) {
      prototypeData.poster = prototypeData.screenshot; 
    }
    Prototype.create({ ...prototypeData, user: req.user.id })
      .then((createdPrototype) => {
        if (req.user && req.user.email) {
          mailer.sendPrototypeConfirmationEmail(req.user.email, createdPrototype)
            .catch(error => console.error("Error enviando email:", error));
        }
        res.status(201).json(createdPrototype);
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });

  } catch (error) {
    console.error("Error en create prototype:", error);
    next(error);
  }
};

module.exports.reviewPrototype = (req, res, next) => {
  const { id } = req.params;
  console.log("ID recibido:", id);
  const { status, feedback } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return next(createError(400, "Invalid status, must be 'approved' or 'rejected'"));
  }

  Prototype.findById(id)
  .populate("user") 
  .then((prototype) => {
    if (!prototype) {  
      console.log("❌ Prototipo no encontrado en la base de datos");
      return next(createError(404, "Prototype not found"));
    }
    
    prototype.status = status;
    prototype.feedback = feedback;

    return prototype.save().then((updatedPrototype) => {
      if (updatedPrototype.user && updatedPrototype.user.email) {
        mailer.sendPrototypeStatusEmail(updatedPrototype.user.email, updatedPrototype)
          .catch(error => console.error("Error enviando email:", error));
      } else {
        console.warn("⚠️ Advertencia: El prototipo no tiene usuario o email asociado");
      }

      res.json(updatedPrototype);
    });
  })
  .catch((error) => next(error));
};

module.exports.createComment = (req, res, next) => {
  Prototype.findById(req.params.id)
    .populate("user")
    .then((prototype) => {
      if (!prototype) {
        return next(createError(404, "Prototype not found"));
      }

      return Comment.create({
        text: req.body.text,
        user: req.user.id,
        prototype: req.params.id,
      })
      .then((comment) => {
        if (prototype.user && prototype.user.email) {
          mailer.sendNewCommentEmail(prototype.user.email, prototype, comment)
            .catch(error => console.error("Error enviando email:", error));
        }
        res.status(201).json(comment);
      });
    })
    .catch(next);
};

module.exports.detail = (req, res, next) => {
  const { id } = req.params;

  Prototype.findById(id)
    .populate("comments")
    .then((prototype) => {
      if (!prototype) next(createError(404, "Prototype not found"));
      else res.json(prototype);
    })
    .catch((error) => next(error));
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Prototype.findByIdAndDelete(id)
    .then((prototype) => {
      if (!prototype) {
        return next(createError(404, "Prototype not found"));
      }

      mailer.sendPrototypeDeletedEmail(req.user.email, prototype);
      res.status(204).json({ message: "Prototype deleted successfully" });
    })
    .catch((error) => next(error));
};

module.exports.update = (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const permittedParams = ["title", "description", "startDate", "endDate"];

  Object.keys(body).forEach((key) => {
    if (!permittedParams.includes(key)) delete body[key];
  });

  Prototype.findByIdAndUpdate(id, body, { runValidators: true, new: true })
    .then((prototype) => {
      if (!prototype) next(createError(404, "Prototype not found"));
      else res.status(201).json(prototype);
    })
    .catch((error) => next(error));
};

module.exports.detailComment = (req, res, next) => {
  Comment.findById(req.params.commentId)
    .populate("user") 
    .populate("prototype") 
    .then((comment) => res.json(comment))
    .catch(next);
};

module.exports.deleteComment = (req, res, next) => {
  const { commentId } = req.params;

  Comment.findByIdAndDelete(commentId)
    .then((comment) => {
      if (!comment) {
        return next(createError(404, "Comment not found"));
      }
      res.status(204).send(); 
    })
    .catch((error) => next(error));
};

const storageCapture = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext);
  }
});
const uploadCaptureMiddleware = multer({ storage: storageCapture }).single("capture");

module.exports.uploadCapture = (req, res, next) => {
  if (!req.file) {
    return next(createError(400, "No se ha subido ningún archivo"));
  }
  
  const imageUrl = req.file.path;
  const originalUrl = req.body.originalUrl; 
  const newCapture = new Capture({
    imageUrl,
    originalUrl,
  });

  newCapture.save()
    .then((capture) => res.status(201).json(capture))
    .catch((err) => {
      console.error("Error al guardar la captura:", err);
      next(createError(500, "Error al guardar la captura"));
    });
};

module.exports.uploadCaptureMiddleware = require("../config/storage.config").single("capture");