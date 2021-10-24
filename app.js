const debug = require("debug")("app:init");
const express = require("express");
const morgan = require("morgan");
const users = require("./routes/users");
const config = require("config");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/users/", users);

console.log("Aplication " + config.get("name"));
console.log("BD " + config.get("configDB.host"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan habilitado");
}

debug("Trabajando con la base de datos");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on ${port} port`);
});

app.get("/", (req, res) => {
  res.send("GET request to the homepage");
});
