const gifdb = require('../models/usingDb/controllers/gifdb');


module.exports = (req, res) => {

    gifdb.createGif(req, res);
    
}