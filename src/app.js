import "@babel/polyfill";

import express from "express";
import exphbs from "express-handlebars";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import Knex from "knex";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { Model } from "objection";
import Notifier from "node-notifier";
import moment from 'moment-timezone'

import connection from "../knexfile";
import apiResponseHelper from "./middlewares/api-response-helper";
import apiErrorHandler from "./middlewares/api-error-handler";
import notFoundHandler from "./middlewares/not-found-handler";

import auth from "./routes/auth";
import api from "./routes/api";

dotenv.config();
moment.tz.setDefault(process.env.TIMEZONE);
const app = express();

const { lockForApi } = require("./auth");

const environment = process.env.NODE_ENV || "development";

const knex = Knex(connection[environment]);
knex.migrate.latest([connection.knex]);
Model.knex(knex);

app.use(
  logger("dev", {
    skip: () => app.get("env") === "test"
  })
);

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs"
  })
);

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals = {
    ...process.env
  };
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(apiResponseHelper);
app.use("/api/test", (req, res) => {
  console.log('req.body', req.body);
  res.status(200).json({ success: true });
});

app.use("/", auth);
app.use("/api", lockForApi(), api);
app.use("/public", express.static(path.resolve("public")));

app.use(apiErrorHandler);
app.use(notFoundHandler);

const port = process.env.PORT || '3000';
app.listen(port, async () => {
  console.log("Server listening on port: 127.0.0.1:3000");
  Notifier.notify({
    title: "Marca Horario",
    message: "Server listening on port: 127.0.0.1:3000"
  });

  console.log(`ENV: ${app.get("env")}`);
});

export default app;
