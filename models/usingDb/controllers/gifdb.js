const moment = require('moment');
const db = require('../db');
const uuid = require('../../../uuid');
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
      gifs(id, user_id, title, image, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;

    try {
      const queryText =
        `CREATE TABLE IF NOT EXISTS
      gifs(
        id INT NOT NULL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(328) NOT NULL,
        image VARCHAR(1028) NOT NULL,        
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE       
      )`;
      await creataTable(queryText);
      const values = [
        uuid(),
        req.body.userId,
        req.body.title,
        req.body.image,
        moment(new Date()),
        moment(new Date())
      ];
      const { rows } = await db.query(text, values);
      return res.status(201).json({
        "status": "Success",
        "data": {
          "gifId": rows[0].id,
          "message": "GIF image successfully posted",
          "createdOn": rows[0].created_date,
          "title": rows[0].title,
          "imageUrl": rows[0].image,
        }
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        "status": "error",
        error,
      });
    }
  },

  /**
   * Create A gif comment
   * @param {object} req 
   * @param {object} res
   * @returns {object} gif object 
   */
  async createComment(req, res) {
    const text = `INSERT INTO
      gif_comments(gif_id, user_id, comment, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const getGifsQuery = 'SELECT * FROM gifs WHERE id=$1';
    try {
      const queryText =
        `CREATE TABLE IF NOT EXISTS
      gif_comments(
        id SERIAL,
        gif_id INT NOT NULL,
        user_id INT NOT NULL,
        comment VARCHAR(528) NOT NULL,                
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (gif_id) REFERENCES gifs(id) ON DELETE CASCADE       
      )`;
      await creataTable(queryText);
      const values = [
        req.params.gifId,
        req.body.userId,
        req.body.comment,
        moment(new Date()),
        moment(new Date())
      ];
      const { rows } = await db.query(text, values);
      const gifs = await db.query(getGifsQuery, [req.params.gifId]);
      return res.status(201).json({
        "status": "success",
        "data": {
          "message": "Comment successfully created",
          "createdOn": rows[0].created_date,
          "gifTitle": gifs.rows[0].title,
          "comment": rows[0].comment,
        }
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        "status": "error",
        error,
      });
    }
  },

  /**
   * Get A gif
   * @param {object} req 
   * @param {object} res
   * @returns {object} gif object
   */
  async getGif(req, res) {
    const text = 'SELECT id,created_date,title,image FROM gifs WHERE id = $1';
    const getCommentsQuery = 'SELECT id,comment,user_Id FROM gif_comments where gif_id=$1'
    try {
      const { rows } = await db.query(text, [req.params.gifId]);
      const comments = await db.query(getCommentsQuery, [req.params.gifId]);

      if (!rows[0]) {
        return res.status(404).json({
          "status": "error",
          'error': 'gif not found'
        });
      }

      rows[0]["comments"] = comments.rows;

      return res.status(200).json({
        "status": "success",
        "data": rows[0]
      });

    } catch (error) {
      console.log(error);
      return res.status(400).json({
        "status": "error",
        error
      })
    }
  },

  /**
   * Delete A gif
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async deleteGif(req, res) {
    const deleteQuery = 'DELETE FROM gifs WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.gifId]);


      if (!rows[0] && rows[0].user_id !== req.body.userId) {
        return res.status(404).json({
          "status": "error",
          'error': 'gif not found'
        });
      }
      return res.status(200).json({
        "status": "success",
        'data': {
          "message": 'gif post successfully deleted',
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        "status": "error",
        error
      });
    }
  }
}

module.exports = gif;