const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "/images/profilePic.png" },
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    share: [{ type: Schema.Types.ObjectId, ref: "Post" }],
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    try {
        const hashPass = await bcrypt.hash(this.password, 10);

        this.password = hashPass;

        next();
    } catch (err) {
        next(err);
    }
})

module.exports = mongoose.model("User", UserSchema);
