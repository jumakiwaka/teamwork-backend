const jwt = require('jsonwebtoken');
const db = require('../models/usingDb/db/index');

const queryText = 'SELECT * FROM users WHERE id=$1'

module.exports = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'jujucrafteee');
        const userId = decodedToken.userId;

        const { rows } = await db.query(queryText, [userId]);

        if (req.body.userId && !rows[0] && !rows[0].is_admin && +req.body.userId !== userId) {
            throw new Error('Invalid Request!');
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            "status": "error",
            "error": error,
        });
    }
}