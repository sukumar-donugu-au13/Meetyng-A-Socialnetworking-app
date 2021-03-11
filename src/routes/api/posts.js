require("babel-polyfill");
import express from "express";

import User from "../../schema/userSchema";
import Post from "../../schema/postSchema";

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        var searchObj = req.query;

        if (searchObj.isReply !== undefined) {
            var isReply = searchObj.isReply == "true";
            searchObj.replyTo = { $exists: isReply };
            delete searchObj.isReply;
        }

        var result = await getPosts(searchObj);

        // console.log(result);
        res.status(200).send(result);
    } catch (err) {
        // console.log(err);
        res.sendStatus(400);
        next(err);
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        var postId = req.params.id;

        var postData = await getPosts({ _id: postId });

        postData = postData[0];
        // console.log(postData);

        var results = {
            postData: postData
        }

        if (postData.replyTo !== undefined) {
            results.replyTo = postData.replyTo;
        }

        results.replies = await getPosts({ replyTo: postId });

        res.status(200).send(results);
    } catch (err) {
        // console.log(err);
        res.sendStatus(400);
        next(err);
    }
})

router.post("/", async (req, res, next) => {
    try {

        if (!req.body.content) {
            console.log("Content param not sent with request");
            return res.status(400);
        }

        var postData = {
            content: req.body.content,
            postedBy: req.session.user
        }

        if (req.body.replyTo) {
            postData.replyTo = req.body.replyTo;
        }

        const post = await new Post(postData);

        const data = await User.populate(post, { path: "postedBy" });

        await data.save();

        res.status(201).send(data);
    } catch (err) {
        // console.log(err);
        res.sendStatus(400);
        next(err);
    }
})

router.put("/:id/like", async (req, res, next) => {
    try {
        var postId = req.params.id;
        var userId = req.session.user._id;

        var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

        var option = isLiked ? "$pull" : "$addToSet";

        req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true });

        var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true });

        res.status(200).send(post);
    } catch (err) {
        // console.log(err);
        res.sendStatus(400);
        next(err);
    }
})

router.post("/:id/share", async (req, res, next) => {
    try {
        var postId = req.params.id;
        var userId = req.session.user._id;

        var deletedPost = await Post.findOneAndDelete({ postedBy: userId, shareData: postId })

        var option = deletedPost != null ? "$pull" : "$addToSet";

        var repost = deletedPost;

        if (repost == null) {
            repost = await Post.create({ postedBy: userId, shareData: postId });
        }

        req.session.user = await User.findByIdAndUpdate(userId, { [option]: { share: repost._id } }, { new: true });

        var post = await Post.findByIdAndUpdate(postId, { [option]: { shareUsers: userId } }, { new: true });

        res.status(200).send(post);
    } catch (err) {
        // console.log(err);
        res.sendStatus(400);
        next(err);
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.sendStatus(202);
    } catch (err) {
        // console.log(err);
        res.sendStatus(400);
        next(err);
    }
})

async function getPosts(filter) {
    try {
        var results = await Post.find(filter).populate("postedBy").populate("shareData").populate("replyTo").sort({ "createdAt": -1 });

        results = await User.populate(results, { path: "replyTo.postedBy" });
        return await User.populate(results, { path: "shareData.postedBy" });
    } catch (err) {
        // console.log(err);
        res.sendStatus(400);
    }
}

export default router;