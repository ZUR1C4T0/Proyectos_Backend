const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
  name: String,
  debt: Number
});

// Modelo
const Cliente = mongoose.model("Cliente", ClienteSchema);

module.exports = Cliente;
