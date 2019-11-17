const moment = require('moment');
const db = require('../db');
const uuid = require('../../../uuid');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const creataTable = require('../../../db').createTables;

const article = {
  /**
   * Create A article
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object 
   */
  async createArticle(req, res) {
    const text = `INSERT INTO
      articles(id, user_id, title, article, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;     

    try {
        const queryText =
    `CREATE TABLE IF NOT EXISTS
      articles(
        id INT NOT NULL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(328) NOT NULL,
        article VARCHAR(1028) NOT NULL,        
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE     
      )`;
        await creataTable(queryText);                       
        const values = [  
            uuid(),
            req.body.userId,              
            req.body.title,
            req.body.article,           
            moment(new Date()),
            moment(new Date())
        ];
      const { rows } = await db.query(text, values);            
      return res.status(201).json({
        "status" : "success",
        "data" : {
            "message" : "Article successfully posted",
            "createdOn" : rows[0].created_date,
            "articleId" : rows[0].id,
            "title" : rows[0].title
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
   * Create A comment
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object 
   */
  async createComment(req, res) {
    const text = `INSERT INTO
      article_comments(article_id, user_id, comment, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`; 
    const getArticleQuery = 'SELECT * FROM articles WHERE id=$1';    

    try {
        const queryText =
    `CREATE TABLE IF NOT EXISTS
      article_comments(
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        comment VARCHAR(528) NOT NULL,                
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE     
      )`;
        await creataTable(queryText);                       
        const values = [  
            req.params.articleId,
            req.body.userId,              
            req.body.comment,                       
            moment(new Date()),
            moment(new Date())
        ];
      const { rows } = await db.query(text, values);      
      
      const article = await db.query(getArticleQuery, [req.params.articleId]);            
      return res.status(201).json({
        "status" : "success",
        "data" : {
            "message" : "Comment successfully created",
            "createdOn" : rows[0].created_date,            
            "articleTitle" : article.rows[0].title,
            "article" : article.rows[0].article,
            "comment" : rows[0].comment
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
   * Get A article
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object
   */
  async getarticle(req, res) {
    const text = 'SELECT * FROM articles WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(404).json({
            "status" : "error",
            'error': 'article not found'
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
   * Update A article
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated article
   */
  async editArticle(req, res) {
    const findOneQuery = 'SELECT * FROM articles WHERE id=$1';
    const updateOneQuery =`UPDATE articles
      SET title=$1,article=$2,modified_date=$3
      WHERE id=$4 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.articleId]);
      if(!rows[0] && rows[0].user_id !== +req.body.userId) {
        return res.status(404).json({
            "status" : "error",
            'error': 'article not found'
        });
      }      
      const values = [                   
        req.body.title,
        req.body.article,           
        moment(new Date()),
        +req.params.articleId        
    ];
      const data = await db.query(updateOneQuery, values);    // since rows has already been used  
      return res.status(200).json({
          "status" : "success",
          "data" : {
            "message" : "Article successfully updated",
            "title" : data.rows[0].title,
            "article" : data.rows[0].article
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
   * Delete A article
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async deleteArticle(req, res) {
    const deleteQuery = 'DELETE FROM articles WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.articleId]);
      if(!rows[0] && rows[0].user_id !== +req.body.userId) {
        return res.status(404).json({
            "status" : "error",
            'error': 'article not found'
        });
      }
     
      return res.status(200).json({
          "status" : "success", 
          'data': {
              "message" : 'Article successfully deleted',
          } 
        });
    } catch(error) {
      console.log(error);
      
      return res.status(400).json({
          "status" : "error",
          error
      });
    }
  }
}

module.exports = article;