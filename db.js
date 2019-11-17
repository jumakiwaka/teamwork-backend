const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Tables
 */
const createTables = (queryText) => { 

  return new Promise((resolve, reject) => {
    pool.query(queryText)
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    })
  })
}

/**
 * Drop Tables
 */
const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS users CASCADE';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

pool.on('remove', () => {
  console.log('client removed');
  // process.exit(0);
});

module.exports = {
  createTables,
  dropTables
};

require('make-runnable');