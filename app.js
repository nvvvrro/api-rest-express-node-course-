const debug = require("debug")("app:init");
//const dbDebug=require("debug")("app:db")
const express = require("express");
const morgan = require("morgan");
const Joi = require("joi");
const config = require("config");
//const logger = require("./logger");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//MIDDLEWARE cuando se ejecuta
//app.use(logger);
/* app.use(function (req, res, next) {
  console.log("Autenticando");
  next();
}); */

console.log("Aplication " + config.get("name"));
console.log("BD " + config.get("configDB.host"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan habilitado");
}

debug("Trabajando con la base de datos");

const port = process.env.PORT || 3000;

const users = [
  { id: 1, nombre: "Robert" },
  { id: 2, nombre: "Patricia" },
  { id: 3, nombre: "Jose" },
];

app.listen(port, () => {
  console.log(`listening on ${port} port`);
});

app.get("/", (req, res) => {
  res.send("GET request to the homepage");
});

//GET ALL
app.get("/api/users", (req, res) => {
  res.send(users);
});

/* app.get("/api/users/:id", (req, res) => {
  res.send(req.params);
}); */

//GET BY YEAR AND MONTH
app.get("/api/users/:year/:month", (req, res) => {
  res.send(req.query);
});

//GET BY ID
app.get("/api/users/:id", (req, res) => {
  let user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) res.status(404).send("Usuario no encontrado");

  res.send(user);
});

//POST
app.post("/api/users", (req, res) => {
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
app.put("/api/users/:id", (req, res) => {
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
app.delete("/api/users/:id", (req, res) => {
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
