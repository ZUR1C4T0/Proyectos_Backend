const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path");
const app = express();

// procesamiento del body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// variable flash y sesión
app.use(flash());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "secretKey_Zur1"
  })
);

// motor de vistas
app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "ejs");

// archivos estaticos
app.use(express.static(path.join(__dirname, "/public")));

// rutas
app.use(require("./src/routes/index"));

app.listen(8080, () => console.log("Servidor Iniciado: ", "http://localhost:8080"));
