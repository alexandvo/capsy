require('dotenv').config();

const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE_NAME
});

module.exports = pool;