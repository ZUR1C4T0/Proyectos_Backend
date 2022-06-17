const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Esquema
const ClienteSchema = new Schema({
  name: String,
  debt: Number,
  records: [
    new Schema({
      type: String,
      value: Number,
      description: String,
      date: String
    })
  ]
});

// Modelo
const Cliente = mongoose.model("Cliente", ClienteSchema);

module.exports = Cliente;
