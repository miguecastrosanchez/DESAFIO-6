const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario,
} = require("./consultas");

const app = express();

app.use(cors());
app.use(express.json());


// ============================
// MIDDLEWARE DE REPORTE
// ============================

const reporte = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

app.use(reporte);


// ============================
// MIDDLEWARE CREDENCIALES
// ============================

const validarCredenciales = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    await verificarCredenciales(email, password);

    next();

  } catch (error) {

    res.status(error.code || 500).json({
      message: error.message,
    });

  }
};


// ============================
// MIDDLEWARE TOKEN
// ============================

const validarToken = (req, res, next) => {
  try {

    const Authorization = req.header("Authorization");

    if (!Authorization) {
      throw {
        code: 401,
        message: "Token no enviado",
      };
    }

    const token = Authorization.split("Bearer ")[1];

    jwt.verify(token, "mi_llave_secreta");

    const { email } = jwt.decode(token);

    req.email = email;

    next();

  } catch (error) {

    res.status(error.code || 401).json({
      message: error.message || "Token inválido",
    });

  }
};


// ============================
// RUTA BASE
// ============================

app.get("/", (req, res) => {
  res.send("Servidor Soft Jobs funcionando");
});


// ============================
// REGISTRO USUARIO
// ============================

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


// ============================
// LOGIN
// ============================

app.post("/login", validarCredenciales, (req, res) => {

  const { email } = req.body;

  const token = jwt.sign(
    { email },
    "mi_llave_secreta"
  );

  res.json({
    token,
  });

});


// ============================
// GET USUARIO PROTEGIDO
// ============================

app.get("/usuarios", validarToken, async (req, res) => {
  try {

    const usuarios = await obtenerUsuario(req.email);

    res.json(usuarios);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});


// ============================
// SERVIDOR
// ============================

app.listen(3000, () => {
  console.log("Servidor encendido en http://localhost:3000");
});