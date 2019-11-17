const moment = require('moment');
const uuid = require('uuid');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const creataTable = require('../../../db').createTables;

const user = {
  /**
   * Create A user
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async createUser(req, res) {
    const text = `INSERT INTO
      users(firstname, lastname, email, password, gender, jobrole, department, address, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;     

    try {
      const queryText =
    `CREATE TABLE IF NOT EXISTS
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
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;
        await creataTable(queryText);
        const password_hash = await bcrypt.hash(req.body.password, 7);        
        const values = [           
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            password_hash,
            req.body.gender,
            req.body.jobRole,
            req.body.department,
            req.body.address,
            moment(new Date()),
            moment(new Date())
        ];
      const { rows } = await db.query(text, values);
            
      const token = jwt.sign({userId : rows[0].id}, 'RANDOM_SECRET_KEY', { expiresIn: '24h'});      
      return res.status(201).json({
        "status": "Success!",
        "data": {
            "message": "user account created successfully",
            "token": token,
            "userId": rows[0].id,
        }
    });
    } catch(error) {      
      return res.status(400).json({
            "status" : "error",
            error,          
        });
    }
  },
  /**
   * Get All users
   * @param {object} req 
   * @param {object} res 
   * @returns {object} users array
   */
  async getAllUsers(req, res) {
    const findAllQuery = 'SELECT * FROM users';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).json({
        "status": "Success!",
        "data": {                        
            rows, 
            rowCount
        }
        });
    } catch(error) {
      return res.status(400).json({
          "status" : "error",
          error
      });
    }
  },
  /**
   * Get A user
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object
   */
  async getUser(req, res) {
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(404).json({
            "status" : "error",
            'error': 'user not found'
        });
      }
      
      const isValidPassword = await bcrypt.compare(req.body.password, rows[0].password);
      if(!isValidPassword){        
        return res.status(400).json({
          "status" : "error",
          'error': 'Invalid credentials'
      });
      }else{
        const token = jwt.sign({ userId : rows[0].id}, "RANDOM_SECRET_KEY", {expiresIn: '24h'});
        return res.status(200).json({
          "status" : "success",
          "data" : {
            "token" : token,
            "userId" : rows[0].id
          }
        });
      }     
    } catch(error) {
      console.log(error);
      return res.status(400).json({
          "status" : "error",
          error
      })
    }
  },
  /**
   * Update A user
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated user
   */
  async updateUser(req, res) {
    const findOneQuery = 'SELECT * FROM users WHERE id=$1';
    const updateOneQuery =`UPDATE users
      SET firstname=$1,lastname=$2,email=$3,password=$4,gender=$5,jobrole=$6,department=$7,address=$8,modified_date=$9
      WHERE id=$10 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).json({
            "status" : "error",
            'error': 'user not found'
        });
      }
      const password_hash = await bcrypt.hash(req.body.password, 7);
      const values = [        
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        password_hash,
        req.body.gender,
        req.body.jobrole,
        req.body.department,
        req.body.address,
        moment(new Date()),
        uuid(),
    ];
      const response = await db.query(updateOneQuery, values);     
      return res.status(200).json({
          "status" : "success",
          "data" : [response.rows[0]]
        });
    } catch(error) {
      return res.status(400).json({
        "status" : "error",
        error
    });
    }
  },
  /**
   * Delete A user
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async deleteUser(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).json({
            "status" : "error",
            'error': 'user not found'
        });
      }
      return res.status(204).json({
          "status" : "success", 
          'data': {
              "message" : 'user deleted succesfully',
          } 
        });
    } catch(error) {
      return res.status(400).json({
          "status" : "error",
          error
      });
    }
  }
}

module.exports = user;