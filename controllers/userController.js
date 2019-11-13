const jwt = require('jsonwebtoken');
const User = require("../models/usingDb/controllers/user");

exports.signUp = (req, res) => {

    const { body } = req;
    const fields = [
        'firstName',
        'lastName',
        'email',
        'password',
        'jobRole',
        'department',
        'address'
    ];    
    const hasAllFields = !fields.find(field => body.hasOwnProperty(field) === false);

    if (hasAllFields) {
        User.createUser(req, res);
    } else {
        res.status(400).json({
            "status": "error",
            "error": "missing property in request body"
        })
    }

}

exports.signIn = (req, res) => {
    const { body } = req;
    const fields = [        
        'email',
        'password',        
    ];    
    const hasAllFields = !fields.find(field => body.hasOwnProperty(field) === false);

    if (hasAllFields) {
        User.getUser(req, res);
    } else {
        res.status(400).json({
            "status": "error",
            "error": "missing property in request body"
        })
    }

    res.status(201).json({
        "status": "success",
        "data": {
            "token": "Your token",
            "userId": parseInt(Math.random() * 1000000, 10),
        }
    });
}