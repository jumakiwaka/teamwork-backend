const cloudinary = require('cloudinary').v2;


// var uploads = {};

// set CLOUDINARY configuration
cloudinary.config({
    cloud_name: 'cloudinaryjuma',
    api_key: '388794615337899',
    api_secret: 'rMwAkEzpWh7E1vxNB25kGG_VcsE'
});


// File upload (example for promise api)
async function uploadGif(req, res, next) {
    try {
        const { photo } = req.files;
        // console.log(req.body);

        const MIME_TYPE = [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/gif'
        ];
        const isValidMemeType = !MIME_TYPE.find(mime => photo.mimetype === mime);
        if (isValidMemeType) throw "Invalid meme type";
        if (photo instanceof Array) throw "Multiple uploads not supported!"
        const image = await cloudinary.uploader.upload(photo.tempFilePath, { tags: photo.name });
        req.body.image = image.url;
        next();
    } catch (error) {
        if (error) {
            console.warn(error)
            res.status(400).json({
                "status": "error",
                "error": error
            })
        };
    }
};

module.exports = uploadGif;


