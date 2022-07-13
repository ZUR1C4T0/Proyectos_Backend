const { Router } = require("express");
const router = Router();

// base de datos
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "containers-us-west-73.railway.app",
  user: "root",
  password: "fxDQNtdysBP6lHPrWcyF",
  database: "railway"
});

// ruta de inicio
router.get("/", (req, res) => {
  const query = `
      SELECT titulo, resumen, fecha_hora, nombre, votos
      FROM publicaciones
      INNER JOIN autores
      ON publicaciones.autor_id = autores.id
      ORDER BY fecha_hora DESC
      LIMIT 5;
    `;

  pool.getConnection((err, conection) => {
    try {
      if (err) throw err;

      conection.query(query, (err, result) => {
        if (err) throw err;
        res.render("index", { publicaciones: result, session: req.session.user });
      });
    } catch (err) {
      console.log(err);
      res.status(500);
    } finally {
      //conection.end();
    }
  });
});

// ruta de registro
router.get("/registro", (req, res) => {
  res.render("registro", { alerta: req.flash("alerta") });
  req.session.destroy();
});

// validación de registro
router.post("/procesar_registro", (req, res) => {
  pool.getConnection((err, conection) => {
    try {
      if (err) throw err;

      const nombre = String(req.body.nombre).trim().toLowerCase();
      const email = String(req.body.email).trim().toLowerCase();
      const contrasena = String(req.body.contrasena);

      const consultarNombre = `SELECT * FROM autores WHERE nombre = ${conection.escape(nombre)}`;
      const consultarEmail = `SELECT * FROM autores WHERE email = ${conection.escape(email)}`;
      const registro = `INSERT INTO autores (nombre, email, contrasena) 
      VALUES (
        ${conection.escape(nombre)}, 
        ${conection.escape(email)}, 
        ${conection.escape(contrasena)}
        )`;

      conection.query(consultarNombre, (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          req.flash(
            "alerta",
            `{
            "text": "Ya existe un autor con ese nombre",
            "color": "warning",
            "icon": "fa-triangle-exclamation"
          }`
          );
          res.redirect("/registro");
        } else {
          conection.query(consultarEmail, (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
              req.flash(
                "alerta",
                `{
                "text": "Ya existe un autor con este correo",
                "color": "warning",
                "icon": "fa-triangle-exclamation"
              }`
              );
              res.redirect("/registro");
            } else {
              conection.query(registro, (err, result) => {
                if (err) throw err;

                req.flash(
                  "alerta",
                  `{
                  "text": "Autor registrado!",
                  "color": "success",
                  "icon": "fa-circle-check"
                }`
                );
                res.redirect("/registro");
              });
            }
          });
        }
      });
      //---//
    } catch (err) {
      res.status(500);
      console.log(err);
      //---//
    } finally {
      conection.release();
    }
  });
});

// ruta de ingreso
router.get("/ingreso", (req, res) => {
  res.render("ingreso", { alerta: req.flash("alerta") });
  req.session.destroy();
});

// validación de ingreso
router.post("/procesar_ingreso", (req, res) => {
  pool.getConnection((err, conection) => {
    try {
      if (err) throw err;

      const email = String(req.body.email).trim().toLowerCase();
      const contrasena = String(req.body.contrasena);

      const consultarIngreso = `SELECT * FROM autores 
      WHERE email = ${conection.escape(email)} 
      AND contrasena = ${conection.escape(contrasena)}`;

      conection.query(consultarIngreso, (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          req.session.user = { ...result[0] };
          res.redirect("/");
        } else {
          req.flash(
            "alerta",
            `{
            "text": "Credenciales inválidas, vuelva a intentar.",
            "color": "danger",
            "icon": "fa-circle-exclamation"}`
          );
          res.redirect("/ingreso");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500);
    } finally {
      conection.release();
    }
  });
});

// validacion de cerrar sesión
router.get("/cerrar_sesion", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ruta de administración
router.get("/admin", (req, res) => {
  if (!req.session.user) res.redirect("/ingreso");

  pool.getConnection((err, conection) => {
    try {
      if (err) throw err;

      const getPublicaciones = `
      SELECT * FROM publicaciones
      WHERE autor_id = ${conection.escape(req.session.user.id)};
      `;

      conection.query(getPublicaciones, (err, result) => {
        if (err) throw err;

        res.render("admin", { session: req.session.user, publicaciones: result });
      });
    } catch (err) {
      console.log(err);
      res.status(500);
    } finally {
      conection.release();
    }
  });
});

module.exports = router;
