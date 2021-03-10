const express = require("express");
const fs = require("fs");

const User = require("../../schema/userSchema");
const Post = require("../../schema/postSchema");
const upload = require("../../helpers/multer");
const cloudinary = require("../../helpers/Cloudinary");

const router = express.Router();

router.post("/profilePicture", upload.single('croppedImage'), async (req, res, next) => {
    try {
        if (!req.file) {
            console.log("No file uploaded");
            return res.sendStatus(400);
        }

        var tempPath = req.file.path;

        const newPath = await cloudinary.uploader.upload(tempPath);

        req.session.user = await User.findOneAndUpdate({ "_id": req.session.user._id }, {
            "$set": {
                "profilePic": newPath.secure_url,
                "profilePicDetails": [{
                    profile_url: newPath.secure_url,
                    cloud_id: newPath.public_id
                }]
            }
        }, { new: true });

        fs.unlinkSync(tempPath);

        res.sendStatus(204);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
})

router.post("/coverPhoto", upload.single('croppedImage'), async (req, res, next) => {
    try {
        if (!req.file) {
            console.log("No file uploaded");
            return res.sendStatus(400);
        }

        var tempPath = req.file.path;

        const newPath = await cloudinary.uploader.upload(tempPath);

        req.session.user = await User.findOneAndUpdate({ "_id": req.session.user._id }, {
            "$set": {
                "coverImg": newPath.secure_url,
                "coverImgDetails": [{
                    profile_url: newPath.secure_url,
                    cloud_id: newPath.public_id
                }]
            }
        }, { new: true });

        fs.unlinkSync(tempPath);

        res.sendStatus(204);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
})

module.exports = router;
