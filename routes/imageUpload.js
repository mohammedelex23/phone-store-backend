var app = require('express')()
var multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

app.post('/', upload.single('image'), (req, res) => {
    if (req.file) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, message: 'the image uploaded successfully' })
    } else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ error: true, message: 'Something went wrong!' })
    }

})


module.exports = app