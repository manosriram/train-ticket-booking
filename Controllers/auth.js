const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* Login route for user to persist a session.
 * JWTs are used to create tokens, which inturn will be stored in the browser cookies.
 */
router.post("/login", async (req, res) => {
    const { pool } = req;
    const { email, password } = req.body;

    pool.query(
        "select id, password from railuser where email = $1",
        [email],
        (err, rows) => {
            if (err) {
                return res.render("login", {
                    message: null,
                    error: err,
                    user: null
                });
            }
            // Check if the user exists.
            if (rows.rows.length === 0) {
                return res.render("login", {
                    message: null,
                    error: "User not found",
                    user: null
                });
            } else {
                // Create a payload which will be stored in the token.
                const payload = {
                    email,
                    id: rows.rows[0].id
                };
                // Check if the hashed password(in DB) and the given password matches.
                const passwordMatch = bcrypt.compareSync(
                    password,
                    rows.rows[0].password
                );
                if (!passwordMatch)
                    return res.render("login", {
                        message: null,
                        error: "Password incorrect",
                        user: null
                    });
                else {
                    // Sign a token, if all goes well and create a cookie with that token value.
                    jwt.sign(payload, "secret", (err, token) => {
                        if (err) console.error(err);
                        else {
                            res.cookie("jwt", token);
                            return res.redirect("/home");
                        }
                    });
                }
            }
        }
    );
});

/* Registers a user to DB.
 * Password is hashed for enhanced security.
 */
router.post("/signup", async (req, res) => {
    const { pool } = req;
    const { email, firstName, lastName, password } = req.body;

    // If user already exists, we should not allow the user to create another user with same details.
    pool.query(
        "select id from railuser where email = $1",
        [email],
        (err, rows) => {
            if (rows.rows.length > 0)
                return res.render("register", {
                    error: "User already exists",
                    message: null,
                    user: null
                });
            else {
                // Create a hash and use the salt to randomize the hash.
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                pool.query(
                    "insert into railuser(email, first_name, last_name, password) values($1, $2, $3, $4)",
                    [email, firstName, lastName, hash],
                    (err, rows) => {
                        return res.render("register", {
                            message: "Successfully signed up",
                            error: null,
                            user: null
                        });
                    }
                );
            }
        }
    );
});

// Logout the user by just clearing the cookie.
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/");
});

module.exports = router;
