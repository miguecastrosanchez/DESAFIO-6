const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");


const {registrarUsuario, verificarCredenciales} = require("./consultas");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor Soft Jobs funcionando");
});

app.listen(3000, () => {
  console.log("Servidor encendido en http://localhost:3000");
});

app.post("/usuarios", async (req, res) => {
  try {

    const usuario = req.body;

    await registrarUsuario(usuario);

    res.send("Usuario creado con éxito");

  } catch (error) {

    console.log(error);

    res.status(500).send(error);

  }
});

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    await verificarCredenciales(email, password);

    const token = jwt.sign(
      { email },
      "mi_llave_secreta"
    );

    res.json({
      token
    });

  } catch (error) {

    console.log(error);

    res.status(error.code || 500).json({
      message: error.message || "Error del servidor"
    });

  }

});