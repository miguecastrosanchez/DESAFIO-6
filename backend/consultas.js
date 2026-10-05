const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "dobby7",
  database: "softjobs",
  port: 5432,
});

module.exports = { pool };