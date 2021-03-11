import cloudinary from "cloudinary";

const cloud = cloudinary.v2

// cloud.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

cloud.config({
    cloud_name: "imgvidcloud",
    api_key: "948156618491655",
    api_secret: "-cKcyndnn0tzXZBOROgIqDIpGxs"
});

export default cloud;
