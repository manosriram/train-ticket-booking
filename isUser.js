const jwt = require("jsonwebtoken");

module.exports = function isUser(req, res, next) {
    // If no cookie is present, user is not logged-in.
    if (!req.headers.cookie)
        return res.render("login", {
            message: null,
            error: "User not logged in"
        });

    // Somehow parse the cookie with name "jwt"
    let cookies = req.headers.cookie.split("; ");
    cookies = cookies.filter(cookie => {
        if (cookie.split("=")[0] === "jwt") return cookie.split("=")[1];
        else return false;
    });
    // If no cookies with name "jwt" are present, user isn't logged-in.
    if (cookies.length === 0)
        return res.render("login", {
            message: null,
            error: "User not logged in"
        });
    // Else, parse the token from the cookie and verify it using jwt.
    else {
        cookies = cookies[0].split("=")[1];
        req.token = cookies;

        // On verification, it returns a user object which we store in the request object and move forward.
        jwt.verify(req.token, "secret", (err, user) => {
            req.user = user;
            next();
        });
    }
};
