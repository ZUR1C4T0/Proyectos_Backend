const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const Cliente = require("../models/Cliente.js");

router.get("/", async (req, res) => {
  try {
    const arrayClientes = await Cliente.find();
    res.render("index", { arrayClientes });
  } catch (error) {
    console.log(error);
  }
});

router.use("/clientes", require("./client-router.js"));

module.exports = router;
