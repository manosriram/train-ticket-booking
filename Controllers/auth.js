const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
    const { pool } = req;
    const { email, password } = req.body;

    pool.query(
        "select id, password from railuser where email = $1",
        [email],
        (err, rows) => {
            if (rows.rows.length === 0) {
                return res.render("login", {
                    message: null,
                    error: "User not found",
                    user: null
                });
            } else {
                const payload = {
                    email,
                    id: rows.rows[0].id
                };
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
                    jwt.sign(payload, process.env.SECRET, (err, token) => {
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

router.post("/signup", async (req, res) => {
    const { pool } = req;
    const { email, firstName, lastName, password } = req.body;

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

router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/");
});

module.exports = router;
