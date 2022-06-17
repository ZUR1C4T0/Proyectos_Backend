const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Esquema
const RegistroShema = new Schema({
  type: String,
  value: Number,
  description: String,
  date: Date,
  author: Object
});

// Modelo
const Registro = mongoose.model("Registro", RegistroShema);

module.exports = Registro;
