const express = require("express");

const User = require("../schema/userSchema");

const router = express.Router();

router.get("/", (req, res, next) => {
    try {
        var payload = createPayLoad(req.session.user)

        res.status(200).render("searchPage", payload);
    } catch (err) {
        console.log(err);
    }
});

router.get("/:selectedTab", (req, res, next) => {
    try {
        var payload = createPayLoad(req.session.user);
        payload.selectedTab = req.params.selectedTab;

        res.status(200).render("searchPage", payload);
    } catch (err) {
        console.log(err);
    }
});

function createPayLoad(userLoggedIn) {
    return {
        pageTitle: "Search",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn),
    };
}

module.exports = router;
