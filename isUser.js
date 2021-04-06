const jwt = require("jsonwebtoken");

module.exports = function isUser(req, res, next) {
    if (!req.headers.cookie)
        return res.render("login", {
            message: null,
            error: "User not logged in"
        });
    let cookies = req.headers.cookie.split("; ");
    cookies = cookies.filter(cookie => {
        if (cookie.split("=")[0] === "jwt") return cookie.split("=")[1];
        else return false;
    });
    if (cookies.length === 0)
        return res.render("login", {
            message: null,
            error: "User not logged in"
        });
    else {
        cookies = cookies[0].split("=")[1];
        req.token = cookies;
        jwt.verify(req.token, "secret", (err, user) => {
            req.user = user;
            next();
        });
    }
};
