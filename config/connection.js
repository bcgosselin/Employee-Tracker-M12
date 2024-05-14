require('dotenv').config();
// {path: 'C:/Users/Rcg32/bootcamp/Employee-Tracker-M12/.env'}

const mysql = require('mysql');

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

module.export = connection;