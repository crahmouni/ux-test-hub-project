require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const { loadSession } = require("./config/session.config");
const { loadSessionUser } = require("./middlewares/session.middleware");
const { cors } = require("./config/cors.config");

/* DB init */
require("./config/db.config");



const app = express();

/* Middlewares */
app.use(cors);
app.use(express.json());
app.use(logger("dev"));
app.use(loadSession);
app.use(loadSessionUser);

/* API Routes Configuration */
const routes = require("./config/routes.config");
app.use("/api/v1/", routes);

const port = Number(process.env.PORT || 5000);


app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
  });

