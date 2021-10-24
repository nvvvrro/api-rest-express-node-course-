const express = require("express");
const Joi = require("joi");
const route = express.Router();

const users = [
  { id: 1, nombre: "Robert" },
  { id: 2, nombre: "Patricia" },
  { id: 3, nombre: "Jose" },
];

//GET
route.get("/", (req, res) => {
  res.send(users);
});

route.get("/:id", (req, res) => {
  let user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) res.status(404).send("Usuario no encontrado");

  res.send(user);
});

//POST
route.post("/", (req, res) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });
  const { error, value } = schema.validate({ nombre: req.body.nombre });
  if (!error) {
    const user = {
      id: users.length + 1,
      nombre: value.nombre,
    };
    users.push(user);
    res.send(user);
  } else {
    const message = error.details[0].message;
    res.status(400).send(message);
  }
});

//PUT
route.put("/:id", (req, res) => {
  let user = isFound(req.params.id);

  if (!user) {
    res.status(404).send("Usuario no encontrado");
    return;
  }

  const { error, value } = validateUser(req.body.nombre);

  if (error) {
    const message = error.details[0].message;
    res.status(400).send(message);
    return;
  }

  user.nombre = value.nombre;
  res.send(user);
});

//DELETE
route.delete("/:id", (req, res) => {
  let user = isFound(req.params.id);
  if (!user) {
    res.status(404).send("Usuario no encontrado");
    return;
  }
  const index = users.indexOf(user);
  users.splice(index, 1);

  res.send(user);
});

const isFound = (id) => {
  return users.find((u) => u.id === parseInt(id));
};

const validateUser = (name) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });
  return schema.validate({ nombre: name });
};

module.exports = route;
