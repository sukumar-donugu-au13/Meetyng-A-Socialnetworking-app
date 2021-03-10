const express = require("express");

const User = require("../schema/userSchema");

const router = express.Router();

router.get("/:username", async (req, res, next) => {
    try {
        var payload = await getPayload(req.params.username, req.session.user)

        res.status(200).render("profilePage", payload);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get("/", (req, res, next) => {
    try {
        var payload = {
            pageTitle: req.session.user.username,
            userLoggedIn: req.session.user,
            userLoggedInJS: JSON.stringify(req.session.user),
            profileUser: req.session.user,
            userId: JSON.stringify(req.session.user._id)
        }

        res.status(200).render("profilePage", payload);
    } catch (err) {
        console.log(err);
    }
});

// router.get("/:username/following", async (req, res, next) => {
//     try {
//         var payload = await getPayload(req.params.username, req.session.user)
//         payload.selectedTab = JSON.stringify({ following: "following" });

//         res.status(200).render("followersAndFollowing", payload);
//     } catch (err) {
//         console.log(err);
//         next(err);
//     }
// });

// router.get("/:username/followers", async (req, res, next) => {
//     try {
//         var payload = await getPayload(req.params.username, req.session.user)
//         payload.selectedTab = JSON.stringify({ followers: "followers" });

//         res.status(200).render("followersAndFollowing", payload);
//     } catch (err) {
//         console.log(err);
//         next(err);
//     }
// });

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

module.exports = router;
