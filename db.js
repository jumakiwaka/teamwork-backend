const { Pool } = require('pg');
const dotenv = require('dotenv');
const moment = require('moment');
const bcrypt = require('bcrypt');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
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
/*
Delete test user account
*/
const deleteUser = () => {
  const queryText = 'DELETE FROM users WHERE email=$1';
  pool.query(queryText, ["jumakiwaka@teamwork.com"])
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/*
Create admin user Account
*/
const createSU = () =>{
  const queryText = `CREATE TABLE IF NOT EXISTS
  users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(128) NOT NULL,
    lastname VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    gender VARCHAR(30),
    jobrole VARCHAR(128) NOT NULL,
    department VARCHAR(128) NOT NULL,
    address VARCHAR(128) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP,
    modified_date TIMESTAMP
  )`;

  pool.query(queryText)
  .then(res => {
    console.log(res);
    const createSUQuery = `INSERT INTO 
    users(firstname, lastname, email, password, gender, jobrole, department, address, is_admin, created_date, modified_date)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9, $10, $11)`;
    const pass = bcrypt.hashSync("nothingcanstopme", 7);
    const data =[ 
       "Juma",
       "Kiwaka",
       `juju@admin.com`,
       pass,
       "male",
       "CTO",
       "IT",
       "123, Juja street",
       true,
      moment(new Date()),
      moment(new Date())
    ];
    pool.query(createSUQuery, data).then(res => {
      console.log(res);
      pool.end();
    })
    .catch(error => {
      console.log(error);
      pool.end();
    })
  })
  .catch(error => {
    console.log(error);
    pool.end();
  })
}
pool.on('remove', () => {
  console.log('client removed');
  // process.exit(0);
});

module.exports = {
  createTables,
  dropTables, 
  deleteUser, 
  createSU
};

require('make-runnable');