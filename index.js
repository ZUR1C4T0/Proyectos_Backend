import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();

// capturar body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// configuracion de cors
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200
  })
);

// Conexión a Base de datos
import mongoose from "mongoose";
const MONGO_URL = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}:${process.env.MONGOPORT}`;
const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
  .connect(MONGO_URL, OPTIONS)
  .then(() => console.log("Conectado a la Base de datos"))
  .catch(error => console.log(error));

// importación de enrutador
import router from "./routers/handler.routes.js";
app.use("/api", router);

// iniciar server
const PORT = process.env.PORT || 8080;
app.listen(PORT);
