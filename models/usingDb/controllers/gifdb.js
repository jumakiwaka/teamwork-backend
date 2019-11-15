const moment = require('moment');
const db = require('../db');
const uuid = require('../../../uuid');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const creataTable = require('../../../db').createTables;

const gif = {
  /**
   * Create A gif
   * @param {object} req 
   * @param {object} res
   * @returns {object} gif object 
   */
  async createGif(req, res) {
    const text = `INSERT INTO
      gifs(id, title, image, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`;     

    try {
        const queryText =
    `CREATE TABLE IF NOT EXISTS
      gifs(
        id INT NOT NULL PRIMARY KEY,
        title VARCHAR(328) NOT NULL,
        image VARCHAR(1028) NOT NULL,        
        created_date TIMESTAMP,
        modified_date TIMESTAMP       
      )`;
        await creataTable(queryText);                       
        const values = [  
            uuid(),              
            req.body.title,
            req.body.image,           
            moment(new Date()),
            moment(new Date())
        ];
      const { rows } = await db.query(text, values);            
      return res.status(201).json({
        "status" : "Success",
        "data" : {
            "gifId" : rows[0].id,
            "message" : "GIF image successfully posted",
            "createdOn" : rows[0].created_date,
            "title" : rows[0].title,
            "imageUrl" : rows[0].image,
        }
    });
    } catch(error) {  
        console.log(error);
            
      return res.status(400).json({
            "status" : "error",
            error,          
        });
    }
  },
  /**
   * Get All articles
   * @param {object} req 
   * @param {object} res 
   * @returns {object} articles array
   */
  async getAllarticles(req, res) {
    const findAllQuery = 'SELECT * FROM articles';
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
   * Get A gif
   * @param {object} req 
   * @param {object} res
   * @returns {object} gif object
   */
  async getarticle(req, res) {
    const text = 'SELECT * FROM articles WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(404).json({
            "status" : "error",
            'error': 'gif not found'
        });
      }
      
      const isValidPassword = await bcrypt.compare(req.body.password, rows[0].password);
      if(!isValidPassword){        
        return res.status(400).json({
          "status" : "error",
          'error': 'Invalid credentials'
      });
      }else{
        const token = jwt.sign({ articleId : rows[0].id}, "RANDOM_SECRET_KEY", {expiresIn: '24h'});
        return res.status(200).json({
          "status" : "success",
          "data" : {
            "token" : token,
            "articleId" : rows[0].id
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
   * Update A gif
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated gif
   */
  async updatearticle(req, res) {
    const findOneQuery = 'SELECT * FROM articles WHERE id=$1';
    const updateOneQuery =`UPDATE articles
      SET firstname=$1,lastname=$2,email=$3,password=$4,gender=$5,jobrole=$6,department=$7,address=$8,modified_date=$9
      WHERE id=$10 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).json({
            "status" : "error",
            'error': 'gif not found'
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
   * Delete A gif
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async deletearticle(req, res) {
    const deleteQuery = 'DELETE FROM articles WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).json({
            "status" : "error",
            'error': 'gif not found'
        });
      }
      return res.status(204).json({
          "status" : "success", 
          'data': {
              "message" : 'gif deleted succesfully',
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

module.exports = gif;