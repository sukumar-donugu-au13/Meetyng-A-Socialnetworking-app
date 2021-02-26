const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../schema/User");
const { logSchema } = require("../validation/loginValidation");

const router = express.Router()

router.get("/", (req, res, next) => {
    res.status(200).render("login")
})

router.post("/", async (req, res, next) => {
    try {
        const result = await logSchema.validateAsync(req.body);

        const { logUsername, logPassword } = result;

        const user = await User.findOne({
            $or: [
                { email: logUsername },
                { username: logUsername }
            ]
        });

        if (!user) {
            var alert = "User does not exist";
            return res.render("login", { alert });
        }

        const decPass = await bcrypt.compare(logPassword, user.password);

        if (decPass) {
            req.session.user = user;

            return res.redirect("/");
        }

    } catch (err) {
        if (err.isJoi === true) {
            // console.log(err);
            var alert = err.message;
            return res.render("login", { alert });
        }
        console.log(err);
        // next(err)
    }
})

module.exports = router;
