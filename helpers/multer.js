const multer = require("multer");
const path = require("path");

var fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "../uploads"))
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}.png`);
    }
});

var filterImage = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        return callback(null, true)
    } else {
        req.fileValidationError = "error";
        return callback(null, false);
    }
};

var upload = multer({
    storage: fileStorage,
    fileFilter: filterImage
});

module.exports = upload;
