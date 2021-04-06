const express = require("express");
const router = express();
const isUser = require("../isUser");

router.get("/history", isUser, async (req, res) => {
    try {
        const { pool } = req;

        const userTickets = await pool.query(
            "select * from ticket where user_id = $1",
            [req.user.id]
        );
        userTickets.rows = userTickets.rows.map(ticket => {
            ticket.created_at = new Date(ticket.created_at).toLocaleString();
            ticket.doj = new Date(ticket.doj).toDateString();
            return ticket;
        });
        return res.render("history", {
            message: null,
            error: null,
            history: userTickets.rows.reverse(),
            user: true
        });
    } catch (err) {
        console.log(err);
    }
});

router.post("/book", isUser, async (req, res) => {
    const { pool } = req;
    try {
        const { ticketCount, trainNo, doj } = req.body;

        if (new Date(doj).getTime() < new Date().getTime()) {
            return res.render("book", {
                message: null,
                trains: null,
                user: true,
                error: "Invalid date"
            });
        }
        await pool.query("BEGIN");

        if (ticketCount > 5) {
            return res.render("book", {
                message: null,
                trains: null,
                user: true,
                error: "Max 5 tickets at once"
            });
        }
        console.log(trainNo);

        pool.query(
            "select seat_id from seat where train_no = $1 and is_booked = 'f' order by seat_id fetch first $2 rows only for update",
            [trainNo, ticketCount],
            async (err, rows) => {
                if (err) {
                    return res.render("book", {
                        message: null,
                        error: err,
                        trains: null,
                        user: true
                    });
                }
                if (rows.rows.length < ticketCount)
                    return res.render("book", {
                        message: null,
                        error: "Seats not available",
                        trains: null,
                        user: true
                    });
                for (let t = 0; t < ticketCount; ++t) {
                    if (rows.rows[t]) {
                        const newTicket = await pool.query(
                            "insert into ticket(user_id, train_no, seats, doj) values($1, $2, $3, $4)",
                            [req.user.id, trainNo, ticketCount, doj]
                        );
                        console.log(newTicket);
                        const bookedSeats = await pool.query(
                            "update seat set is_booked = 't' where train_no=$1 and seat_id=$2",
                            [trainNo, rows.rows[t].seat_id]
                        );
                        await pool.query("COMMIT");
                    }
                }
                return res.render("book", {
                    message:
                        "Tickets booked, see user history for more information",
                    error: null,
                    trains: null,
                    user: true
                });
            }
        );
    } catch (err) {
        console.log(err);
        await pool.query("ROLLBACK");
    }
});

module.exports = router;
