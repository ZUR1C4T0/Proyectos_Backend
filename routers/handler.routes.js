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
    debt: joi.string().required()
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
    const clientData = await Client.findById({ _id });
    if (clientData) res.json(clientData);
    else res.status(400).json(clientData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

/***Crear nuevo registro***/
router.post("/record/register", async (req, res) => {
  //validación de datos a enviar
  const shemaRegister = joi.object({
    type: joi.string().required(),
    value: joi.number().required(),
    description: joi.string(),
    date: joi.string().required()
  });
  const { error } = shemaRegister.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
});

export default router;
