const createError = require("http-errors");
const User = require("../models/user.model");
const { sendValidationEmail, sendWelcomeEmail } = require("../config/mailer.config");

module.exports.create = (req, res, next) => {
  console.log("📩 Solicitud recibida en el backend", req.body);
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return next(createError(400, "Todos los campos son obligatorios"));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(
          createError(400, {
            message: "User email already taken",
            errors: { email: "Already exists" },
          })
        );
      } else {
        return User.create({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          avatar: req.file ? req.file.path : null,
        }).then((user) => {
          console.log("Usuario creado:", user);
         
          sendValidationEmail(user)
            .then(() => console.log(`Email de validación enviado a ${user.email}`))
            .catch((error) => console.error("Error enviando email de validación:", error));

          sendWelcomeEmail(user.email, user.name)
            .then(() => console.log(`Email de bienvenida enviado a ${user.email}`))
            .catch((error) => console.error("Error enviando email de bienvenida:", error));

          res.status(201).json(user);
        });
      }
    })
    .catch((err) => {
      console.error("Error al crear usuario:", err);  
      next(err);
    });
};

module.exports.update = (req, res, next) => {
  const permittedBody = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    avatar: req.file ? req.file.path : req.body.avatar, 
  };

  Object.keys(permittedBody).forEach((key) => {
    if (permittedBody[key] === undefined) {
      delete permittedBody[key];
    }
  });

  Object.assign(req.user, permittedBody);

  req.user
    .save()
    .then((user) => res.json(user))
    .catch(next);
};

module.exports.validate = (req, res, next) => {
  User.findOne({ _id: req.params.id, activateToken: req.query.token })
    .then((user) => {
      if (user) {
        user.active = true;
        user.save().then((user) => res.json(user));
      } else {
        next(createError(404, "User not found"));
      }
    })
    .catch(next);
};

module.exports.profile = (req, res, next) => {
  res.json(req.user);
};

module.exports.list = (req, res, next) => {
  User.find()
    .then((users) => {
      res.json(users);  
    })
    .catch((err) => {
      console.error("Error al obtener usuarios:", err);
      next(err);  
    });
};