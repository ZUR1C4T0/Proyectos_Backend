const express = require("express");
const Cliente = require("../models/Cliente");
const router = express.Router();

router.post("/agregar", async (req, res) => {
  try {
    req.body.debt = parseInt(req.body.debt);
    await Cliente.create(req.body);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.post("/eliminar/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    await Cliente.findByIdAndDelete({ _id });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/detalles/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const cLienteDB = await Cliente.findOne({ _id });
    res.render("details", { cliente: cLienteDB });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
});

module.exports = router;
