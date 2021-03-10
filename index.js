const path = require("path");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const hbs = require("hbs");
const createError = require("http-errors");
const session = require("express-session");

require("dotenv").config();
require("./helpers/mongoConnect");

const loginRoute = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");
const logoutRoute = require("./routes/logoutRoutes");
const postRoute = require("./routes/postRoutes");
const profileRoute = require("./routes/profileRoutes");
const searchRoute = require("./routes/searchRoutes")

const postApiRoute = require("./routes/api/posts");
const usersApiRoute = require("./routes/api/users");
const requireLogin = require("./Middleware");

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

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false
}))

hbs.registerHelper("when", (operand_1, operator, operand_2, options) => {
    let operators = {                     //  {{#when <operand1> 'eq' <operand2>}}
        'eq': (l, r) => l == r,              //  {{/when}}
        'noteq': (l, r) => l != r,
        'gt': (l, r) => (+l) > (+r),                        // {{#when var1 'eq' var2}}
        'gteq': (l, r) => ((+l) > (+r)) || (l == r),        //               eq
        'lt': (l, r) => (+l) < (+r),                        // {{else when var1 'gt' var2}}
        'lteq': (l, r) => ((+l) < (+r)) || (l == r),        //               gt
        'or': (l, r) => l || r,                             // {{else}}
        'and': (l, r) => l && r,                            //               lt
        '%': (l, r) => (l % r) === 0                        // {{/when}}
    }
    let result = operators[operator](operand_1, operand_2);
    if (result) return options.fn(this);
    return options.inverse(this);
});

hbs.registerHelper('ifFollowButton', function (profileUser, userLoggedIn, options) {
    var result = userLoggedIn.following && userLoggedIn.following.includes(profileUser._id.toString());

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper("setVar", function (varName, varValue, options) {
    options.data.root[varName] = varValue;
});

hbs.registerHelper('json', function (context) {
    return JSON.stringify(context);
});

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/posts", requireLogin, postRoute);
app.use("/profile", requireLogin, profileRoute);
app.use("/search", requireLogin, searchRoute);

app.use("/api/posts", postApiRoute);
app.use("/api/users", usersApiRoute);

app.get("/", requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }

    res.status(200).render("home", payload)
});

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("404")
});

app.listen(PORT, () => console.log(`App is running on ${PORT}`));
