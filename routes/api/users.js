const express = require("express");
const fs = require("fs");

const User = require("../../schema/userSchema");
const Post = require("../../schema/postSchema");
const upload = require("../../helpers/multer");
const cloudinary = require("../../helpers/Cloudinary");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        var searchObj = req.query;

        if (req.query.search !== undefined) {
            searchObj = {
                $or: [
                    { firstName: { $regex: req.query.search, $options: "i" } },
                    { lastName: { $regex: req.query.search, $options: "i" } },
                    { username: { $regex: req.query.search, $options: "i" } }
                ]
            }
        }

        const results = await User.find(searchObj);
        res.status(200).send(results);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
})

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
        console.log(err);
        res.sendStatus(400);
    }
})

// router.get("/:userId/following", async (req, res, next) => {
//     try {
//         const results = await User.findById(req.params.userId).populate("following");

//         res.status(200).send(results);
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(400);
//     }
// })

// router.get("/:userId/followers", async (req, res, next) => {
//     try {
//         const results = await User.findById(req.params.userId).populate("followers");

//         res.status(200).send(results);
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(400);
//     }
// })

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