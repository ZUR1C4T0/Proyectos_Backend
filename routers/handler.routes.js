import express from "express";
const router = express.Router();
import joi from "@hapi/joi";
/***modelo de mongoose***/
import Client from "../models/Client.js";

/***Crear nuevo cliente***/
router.post("/client/register", async (req, res) => {
  //validación de datos a enviar
  const shemaRegister = joi.object({
    name: joi.string().required().min(4).max(255),
    debt: joi.number().required()
  });
  const { error } = shemaRegister.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // validación de nombre unico
  const clientExists = await Client.findOne({ name: req.body.toLowerCase() });
  if (clientExists) return res.status(400).json({ error: '"name" client already exists' });

  // nuevo cliente a enviar
  const newClient = new Client({
    name: req.body.name.toLowerCase(),
    debt: Number(req.body.debt)
  });

  try {
    const savedClient = await Client.create(newClient);
    res.json({ data: savedClient });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

/***Eliminar cliente y registros***/
router.delete("/client/delete/:id", async (req, res) => {
  // se obtiene el parametro id de la url
  const _id = req.params.id;
  try {
    // se busca y se elimina al cliente
    const deletedClient = await Client.findByIdAndDelete({ _id });
    if (deletedClient) res.json(deletedClient);
    else res.status(404).json({ error: '"client" to delete not found' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

/***Obtener lista de clientes***/
router.get("/client", async (req, res) => {
  try {
    // se busca los clientes y se orndenan por nombre
    const clientList = await Client.find({}, { records: 0 }, { sort: "name" });
    if (clientList) res.json(clientList);
    else res.status(400).json(clientList);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

/***Obtener cliente***/
router.get("/client/:id", async (req, res) => {
  // se obtiene el parametro id de la url
  const _id = req.params.id;
  try {
    // se busca el cliente segun su id
    const clientData = await Client.findById({ _id }, { records: 0 });
    if (clientData) res.json(clientData);
    else res.status(400).json(clientData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

/***Crear nuevo registro***/
router.put("/records/:id/register", async (req, res) => {
  const _id = req.params.id;
  //validación de datos a enviar
  const shemaRegister = joi.object({
    type: joi.string().required(),
    value: joi.number().required(),
    description: joi.string(),
    date: joi.string().required()
  });
  const { error } = shemaRegister.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // se busca el cliente y se actualiza la deuda
    const clientToEdit = await Client.findById({ _id });
    let newDebt;
    if (req.body.type === "payment") newDebt = clientToEdit.debt - req.body.value;
    else if (req.body.type === "purchase") newDebt = clientToEdit.debt + req.body.value;
    else res.status(400);

    // se edita el cliente y se agrega el registro
    const clientEdited = await Client.updateOne(
      { _id },
      { debt: newDebt, $push: { records: [req.body] } }
    );
    res.json({ data: clientEdited });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

/***Obtener registros de un cliente***/
router.get("/records/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    // se buscan los registros del cliente segun su id
    const clientRecords = await Client.findById({ _id }, { records: 1 });
    if (clientRecords)
      res.json(clientRecords.records.sort((a, b) => new Date(b.date) - new Date(a.date)));
    else res.status(400).json({ clientRecords });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

export default router;
