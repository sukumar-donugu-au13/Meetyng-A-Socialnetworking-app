const express = require("express");

const router = express.Router()

router.get("/", (req, res, next) => {
    try {
        if (req.session) {
            req.session.destroy(() => {
                res.redirect("/login");
            });
        }
    } catch (err) {
        next(err);
    }
})

module.exports = router;
