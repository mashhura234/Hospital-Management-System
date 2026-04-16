const { poolPromise } = require('./db');

const initDb = async () => {
    try {
        const pool = await poolPromise;
        console.log('✅ Database initialized successfully');
    } catch (err) {
        console.error('❌ Database initialization failed:', err);
    }
};

module.exports = initDb;