const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/imgvidcloud/image/upload/v1615371489/profilePic.png"
    },
    coverImg: { type: String },
    profilePicDetails: [{ profile_url: String, cloud_id: String }],
    coverImgDetails: [{ cover_url: String, cloud_id: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    share: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }]
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
