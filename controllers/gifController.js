const gifdb = require('../models/usingDb/controllers/gifdb');


module.exports = (req, res) => {

    gifdb.createGif(req, res);
    // res.status(201).json({
    //     "status" : "Success",
    //     "data" : {
    //         "gifId" : parseInt(Math.random()*1000),
    //         "message" : "GIF image successfully posted",
    //         "createdOn" : Date.now(),
    //         "title" : "I am gif!",
    //         "imageUrl" : "/img/gif2938",
    //     }
    // });
}