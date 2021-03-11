import express from "express";

const router = express.Router()

router.get("/:id", (req, res, next) => {
    try {
        var payload = {
            pageTitle: "View post",
            userLoggedIn: req.session.user,
            userLoggedInJs: JSON.stringify(req.session.user),
            postId: JSON.stringify(req.params.id)
        }

        res.status(200).render("postPage", payload);
    } catch (err) {
        next(err);
    }
})

export default router;
