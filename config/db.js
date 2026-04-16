const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: 'localhost\\SQLEXPRESS',
    database: process.env.DB_NAME,
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: 'SQLEXPRESS'
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Connected to SQL Server successfully');
        return pool;
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
    });

module.exports = { sql, poolPromise };