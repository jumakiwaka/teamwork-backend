const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'jujucrafteee');
        const userId = decodedToken.userId;

        if (req.body.userId && +req.body.userId !== userId) {
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