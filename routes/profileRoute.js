const express = require("express");

const User = require("../schema/userSchema");

const router = express.Router();

router.get("/", (req, res) => {

    var payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }

    res.status(200).render("profilePage", payload);
});

router.get("/:username", async (req, res, next) => {
    try {
        var payload = await getPayload(req.params.username, req.session.user)

        res.status(200).render("profilePage", payload);
    } catch (err) {
        // console.log(err)
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

    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedIn: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}

module.exports = router;
