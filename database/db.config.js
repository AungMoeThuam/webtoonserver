const mysql = require("mysql");
require("dotenv").config();

const {
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME,
} = process.env;

const database = mysql.createConnection({
  user: DATABASE_USER,
  host: DATABASE_HOST,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  multipleStatements: true,
});

module.exports = database;
