require("babel-polyfill");
import express from "express";
import fs from "fs";

import User from "../../schema/UserSchema";
import upload from "../../helpers/multer";
import cloud from "../../helpers/Cloudinary";

const router = express.Router();

router.put("/:userId/follow", async (req, res, next) => {
    try {
        var userId = req.params.userId

        var user = await User.findById(userId);

        if (!user) {
            return res.sendStatus(404);
        }

        var isFollowing = user.followers && user.followers.includes(req.session.user._id);
        var option = isFollowing ? "$pull" : "$addToSet";

        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId } }, { new: true });

        await User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id } }, { new: true });

        res.status(200).send(req.session.user);
    } catch (err) {
        // console.log(err);
        res.sendStatus(400);
    }
})

router.post("/profilePicture", upload.single('croppedImage'), async (req, res, next) => {
    try {
        if (!req.file) {
            console.log("No file uploaded");
            return res.sendStatus(400);
        }

        var tempPath = req.file.path;

        const newPath = await cloud.uploader.upload(tempPath);

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
        // console.log(err);
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

        const newPath = await cloud.uploader.upload(tempPath);

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
        // console.log(err);
        res.sendStatus(400);
    }
})

export default router;
