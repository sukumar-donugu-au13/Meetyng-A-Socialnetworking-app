const path = require("path");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const hbs = require("hbs");
require("dotenv").config();
require("./helpers/MongoConnect");

const loginRoute = require("./routes/LoginRoute");
const registerRoute = require("./routes/RegisterRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan("dev"));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));
hbs.registerPartials(path.join(__dirname, "/views/partials"), function (err) { });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res, next) => {
    var payload = {
        pageTitle: "Home"
    }

    res.status(200).render("home", payload)
});

app.use("/login", loginRoute);
app.use("/register", registerRoute);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("404")
});

app.listen(PORT, () => console.log(`App is running on ${PORT}`));
