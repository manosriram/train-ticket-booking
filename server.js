const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient();
require("dotenv").config();

const { promisify } = require("util");
const aget = promisify(client.get).bind(client);
const aset = promisify(client.set).bind(client);

const pool = new Pool();

app.use((req, res, next) => {
    req.pool = pool;
    req.aset = aset;
    req.aget = aget;
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));
app.use(morgan("dev"));

function checkUser(req, res, next) {
    req.user = null;
    if (!req.headers.cookie) {
        next();
    }
    let cookies = req.headers.cookie.split("; ");
    cookies = cookies.filter(cookie => {
        if (cookie.split("=")[0] === "jwt") return cookie.split("=")[1];
        else return false;
    });
    if (cookies.length === 0) next();
    else {
        cookies = cookies[0].split("=")[1];
        req.token = cookies;
        jwt.verify(req.token, "secret", (err, user) => {
            req.user = user;
            next();
        });
    }
}

app.get("/", checkUser, (req, res) => {
    if (req.user) res.render("home", { user: req.user });
    else res.render("index", { user: null });
});

app.use("/user", require("./Controllers/user_trains"));
app.use("/auth", require("./Controllers/auth"));
app.use("/train", require("./Controllers/trains"));
app.use("/", require("./Controllers/render"));

app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});
