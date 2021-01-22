var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "././files/storage/user_imgs/");
    },
    filename: function (req, file, cb) {
        cb(null, req.session.username+".png");
    }
});

module.exports =  multer({ storage:storage }).single('file');
