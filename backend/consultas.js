const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "dobby7",
  database: "softjobs",
  port: 5432,
});

const registrarUsuario = async (usuario) => {
  
    let { email, password, rol, lenguage } = usuario;

  const passwordEncriptada = bcrypt.hashSync(password);

  const consulta = `
    INSERT INTO usuarios
    VALUES (DEFAULT, $1, $2, $3, $4)
  `;

  const values = [
    email,
    passwordEncriptada,
    rol,
    lenguage
  ];

  await pool.query(consulta, values);
};

module.exports = { pool, registrarUsuario };