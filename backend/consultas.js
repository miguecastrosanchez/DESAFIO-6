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

const verificarCredenciales = async (email, password) => {

  const consulta = "SELECT * FROM usuarios WHERE email = $1";

  const values = [email];

  const { rows: [usuario], rowCount } = await pool.query(
    consulta,
    values
  );

  if (!rowCount) {
    throw {
      code: 401,
      message: "Email o contraseña incorrecta"
    };
  }

  const passwordEsCorrecta = bcrypt.compareSync(
    password,
    usuario.password
  );

  if (!passwordEsCorrecta) {
    throw {
      code: 401,
      message: "Email o contraseña incorrecta, intenta de nuevo"
    };
  }

  return usuario;
};

const obtenerUsuario = async (email) => {

  const consulta = `
    SELECT email, rol, lenguage
    FROM usuarios
    WHERE email = $1
  `;

  const { rows } = await pool.query(consulta, [email]);

  return rows;
};

module.exports = { pool, registrarUsuario, verificarCredenciales, obtenerUsuario };