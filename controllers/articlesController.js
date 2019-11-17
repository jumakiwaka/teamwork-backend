const articlesdb = require('../models/usingDb/controllers/articlesdb');

module.exports = {
    
    createArticle : (req, res) => {
   
    const { body } = req;
    const fields = [        
        'title',
        'article',        
    ];    
    const hasAllFields = !fields.find(field => body.hasOwnProperty(field) === false);

    if (hasAllFields) {        
        articlesdb.createArticle(req, res);
    } else {
        res.status(400).json({
            "status": "error",
            "error": "missing property in request body"
        })
    }
    
    },

    editArticle : (req, res) => {
        const { body } = req;
    const fields = [        
        'title',
        'article',        
    ];    
    const hasAllFields = !fields.find(field => body.hasOwnProperty(field) === false);

    if (hasAllFields) {        
        articlesdb.editArticle(req, res);
    } else {
        res.status(400).json({
            "status": "error",
            "error": "missing property in request body"
        })
    }
    }
}