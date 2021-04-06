const express = require("express");
const router = express();
const isUser = require("../isUser");

/* All the routes here, renders the EJS (template) file.
 * It takes a parameter, which is a data object taken to the EJS file.
 */

router.get("/status", isUser, (req, res) => {
    res.render("status", {
        message: null,
        error: null,
        data: null,
        user: true,
        status: null,
        station: null
    });
});

router.get("/book", isUser, (req, res) => {
    res.render("book", {
        message: null,
        error: null,
        trains: null,
        user: true
    });
});

router.get("/list", isUser, (req, res) => {
    res.render("list", {
        message: null,
        error: null,
        trains: null,
        user: true
    });
});

router.get("/search", isUser, (req, res) => {
    res.render("search", {
        message: null,
        error: null,
        trains: null,
        user: true
    });
});

router.get("/arrivals", isUser, (req, res) => {
    res.render("arrivals", {
        message: null,
        error: null,
        user: true,
        arrivals: null
    });
});

router.get("/revenue", isUser, (req, res) => {
    res.render("revenue", {
        message: null,
        error: null,
        user: true,
        revenue: null
    });
});

router.get("/home", isUser, (req, res) => {
    res.render("home", { message: null, error: null, user: true });
});

router.get("/register", (req, res) => {
    res.render("register", { message: null, error: null, user: null });
});

router.get("/login", (req, res) => {
    res.render("login", { message: null, error: null, user: null });
});

module.exports = router;
