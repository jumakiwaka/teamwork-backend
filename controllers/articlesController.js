const articlesdb = require('../models/usingDb/controllers/articlesdb');

module.exports = (req, res) => {
    //saves the article and send a response
    // res.status(201).json({
    //     "status" : "success",
    //     "data" : {
    //         "message" : "Article successfully posted",
    //         "createdOn" : "moment(new Date())",
    //         "articleId" : 1,
    //         "title" : "Node 12"
    //     }
    // })
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
    
}