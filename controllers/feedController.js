const db = require('../models/usingDb/db/index');

const getArticlesQuery = `SELECT 
                        id,created_date,title,article,user_id 
                        FROM articles                        
                        UNION 
                        SELECT
                        id,created_date,title,image,user_id
                        FROM gifs
                        ORDER BY created_date DESC
                        `;





module.exports = async (req, res) => {
    try {        
        const {rows} = await db.query(getArticlesQuery); 
        res.status(200).json({
           "status" : "success",
           "data" : rows
       })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "status" : "Error",
            "Error" : error
        })
    }
}