// backend/config/database.js
const mysql = require('mysql2/promise');

let pool;

const connectDB = async () => {
  if (pool) return pool;

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('MySQL conectado com sucesso!');
    return pool;
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
