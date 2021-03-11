require("babel-polyfill");
import express from "express";

import User from "../schema/UserSchema";

const router = express.Router();

router.get("/:username", async (req, res, next) => {
    try {
        var payload = await getPayload(req.params.username, req.session.user)

        res.status(200).render("profilePage", payload);
    } catch (err) {
        // console.log(err);
        next(err);
    }
});

async function getPayload(username, userLoggedIn) {
    var user = await User.findOne({ username });

    if (!user) {
        user = await User.findById(username);

        if (!user) {
            return {
                pageTitle: "User not found",
                userLoggedIn: userLoggedIn,
                userLoggedInJS: JSON.stringify(userLoggedIn)
            }
        }
    }

    // console.log(user);

    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user,
        userId: JSON.stringify(user._id)
    }
}

export default router;
