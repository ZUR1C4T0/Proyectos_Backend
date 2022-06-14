const express = require("express");
const Cliente = require("../models/Cliente");
const router = express.Router();

router.get("/:id", async (req, res) => {});

router.post("/agregar", async (req, res) => {
  try {
    req.body.debt = parseInt(req.body.debt);
    await Cliente.create(req.body);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
