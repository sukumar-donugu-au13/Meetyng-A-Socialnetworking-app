const express = require("express");

const User = require("../schema/userSchema");

const router = express.Router()

router.get("/:id", (req, res, next) => {
    var payload = {
        pageTitle: "View post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: JSON.stringify(req.params.id)
    }

    res.status(200).render("postPage", payload);
})

module.exports = router;
