require("babel-polyfill");
import express from "express";

const router = express.Router();

import User from "../schema/UserSchema";
import { schema } from "../validation/UserValidation";

router.get("/", (req, res) => {
    res.status(200).render("register");
});

router.post("/", async (req, res, next) => {
    try {
        const result = await schema.validateAsync(req.body);

        // console.log(result);
        const { firstName, lastName, username, email, password } = result;

        const doesExist = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (doesExist) {
            var alert = "User already exist";
            return res.render("register", { alert });
        }

        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password
        });

        await user.save();

        // console.log(user);
        req.session.user = user;
        return res.redirect("/");

    } catch (err) {
        if (err.isJoi === true) {
            // console.log(err);
            var alert = err.message;
            return res.render("register", { alert });
        }
        // console.log(err)
        next(err);
    }
});


export default router;
