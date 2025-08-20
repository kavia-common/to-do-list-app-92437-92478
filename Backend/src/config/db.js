const { Pool } = require('pg');

/**
 * Create a PostgreSQL pool from environment variables.
 * Supports either DATABASE_URL or individual POSTGRES_* env vars.
 */
const createPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
      max: parseInt(process.env.PGPOOL_MAX || '10', 10),
      idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
    };
  }
  return {
    host: process.env.POSTGRES_URL || process.env.PGHOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || process.env.PGPORT || '5432', 10),
    user: process.env.POSTGRES_USER || process.env.PGUSER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || '',
    database: process.env.POSTGRES_DB || process.env.PGDATABASE || 'postgres',
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
    max: parseInt(process.env.PGPOOL_MAX || '10', 10),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
  };
};

const pool = new Pool(createPoolConfig());

pool.on('error', (err) => {
  console.error('Unexpected PG client error', err);
});

module.exports = {
  pool,
  /**
   * Execute a parameterized query with optional client.
   * Automatically logs and rethrows errors with safe message.
   */
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      console.error('DB query error', { text, err: err.message });
      const error = new Error('Database error');
      error.status = 500;
      throw error;
    }
  },
};
