const gifdb = require('../models/usingDb/controllers/gifdb');


module.exports = {

    createGif : (req, res) => {
        gifdb.createGif(req, res);
    },

    deleteGif : (req, res) => {
        gifdb.deleteGif(req, res);
    },

    createComment: (req, res) => {
        gifdb.createComment(req, res);
    }
    
}