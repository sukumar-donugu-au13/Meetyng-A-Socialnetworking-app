require("babel-polyfill");
import express from "express";

import bcrypt from "bcryptjs";

import User from "../schema/UserSchema";
import { logSchema } from "../validation/loginValidation";

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
        } else {
            var alert = "Username or password incorrect";
            return res.render("login", { alert });
        }

    } catch (err) {
        if (err.isJoi === true) {
            // console.log(err);
            var alert = err.message;
            return res.render("login", { alert });
        }
        // console.log(err);
        next(err)
    }
})

export default router;
