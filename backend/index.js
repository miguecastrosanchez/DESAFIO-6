const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor Soft Jobs funcionando");
});

app.listen(3000, () => {
  console.log("Servidor encendido en http://localhost:3000");
});