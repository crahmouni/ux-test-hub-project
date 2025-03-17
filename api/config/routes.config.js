const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const createError = require("http-errors");
const prototypes = require("../controllers/prototypes.controller");
const users = require("../controllers/users.controller");
const sessions = require("../controllers/sessions.controller");
const auth = require("../middlewares/session.middleware");
const storage = require("../config/storage.config");
const stats = require("../controllers/stats.controller");
const prototypeController = require("../controllers/prototypes.controller");
const capturesController = require("../controllers/captures.controller");

const capturesRoutes = require("./captures")

router.use("/api/v1", capturesRoutes);
router.get("/prototypes", auth.isAuthenticated, prototypes.list);
router.post("/prototypes", auth.isAuthenticated, auth.isAdmin, prototypes.create);
router.get("/prototypes/:id", prototypes.detail);
router.delete("/prototypes/:id", auth.isAuthenticated, auth.isAdmin, prototypes.delete);
router.patch("/prototypes/:id", auth.isAuthenticated, auth.isAdmin, prototypes.update);

router.post("/prototypes/:id/comments", auth.isAuthenticated, prototypes.createComment);
router.get("/prototypes/:id/comments/:commentId",auth.isAuthenticated, prototypes.detailComment);
router.delete("/prototypes/:id/comments/:commentId", auth.isAuthenticated, prototypes.deleteComment);

router.post("/captures", prototypes.uploadCaptureMiddleware, prototypes.uploadCapture);
router.get("/captures", capturesController.list);

router.post("/users", storage.single("avatar"), users.create);
router.patch("/users/me", auth.isAuthenticated, users.update);
router.get("/users/me", auth.isAuthenticated, users.profile);
router.get("/users/:id/validate", users.validate);

router.get("/users", usersController.list); 
router.post("/users", usersController.create);

router.post("/sessions", sessions.create);
router.delete("/sessions", auth.isAuthenticated, sessions.destroy);

router.get("/stats/prototypes", stats.getTopPrototypes);
router.get("/stats/users", stats.getTopUsers);
router.get("/stats/general", stats.getGeneralStats);

router.patch("/prototypes/:id/review", auth.isAuthenticated, auth.isAdmin, prototypes.reviewPrototype);


router.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

router.use((error, req, res, next) => {
  if (
    error instanceof mongoose.Error.CastError &&
    error.message.includes("_id")
  )
    error = createError(404, "Resource not found");
  else if (error instanceof mongoose.Error.ValidationError)
    error = createError(400, error);
  else if (!error.status) error = createError(500, error.message);
  console.error(error);

  const data = {};
  data.message = error.message;
  if (error.errors) {
    data.errors = Object.keys(error.errors).reduce((errors, errorKey) => {
      errors[errorKey] =
        error.errors[errorKey]?.message || error.errors[errorKey];
      return errors;
    }, {});
  }
  res.status(error.status).json(data);
});

module.exports = router;
