const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

// Conexión a la base de datos
const mongoose = require("mongoose");
const MONGO_URL = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}:${process.env.MONGOPORT}`;

mongoose
  .connect(process.env.MONGO_URL || MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a la base de datos :D"))
  .catch(err => console.log(err));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// motor de plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// directorio de archivos estáticos
app.use(express.static(__dirname + "/public"));

// Rutas:
app.use("/", require("./routers/main-router.js"));

// redirección a la página 404
app.use((req, res, next) => {
  res.status(404).render("404");
});

// escuchador del puerto
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("servidor iniciado en el puerto " + port);
});
