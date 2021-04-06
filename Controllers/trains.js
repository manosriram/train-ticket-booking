const express = require("express");
const router = express.Router();

router.post("/status", async (req, res) => {
    const { train_no } = req.body;
    const { aget } = req;

    const status = await aget(`status:${train_no}`);
    const station = await aget(`last_known_station:${train_no}`);
    return res.render("status", {
        user: true,
        status: status,
        station: station
    });
});

router.post("/revenue", (req, res) => {
    const { train_no, from, to } = req.body;
    const { pool } = req;

    pool.query(
        "select count(id) from ticket where train_no = $1 and created_at >= $2 and created_at <= $3",
        [train_no, from, to],
        (err, rows) => {
            if (err) {
                return res.render("revenue", {
                    message: null,
                    error: err,
                    user: true,
                    revenue: null
                });
            }
            const revenue = 250 * rows.rows[0].count;
            return res.render("revenue", {
                message: null,
                error: null,
                user: true,
                revenue: revenue
            });
        }
    );
});

router.post("/arrivals", (req, res) => {
    let { from, to, station } = req.body;
    const { pool } = req;

    let qry = "",
        qryArr;
    if (station === "ANY") {
        qry =
            "select * from stop where arrival >= $1 and departure <= $2 and arrival <= $2 and departure >= $1";
        qryArr = [from, to];
    } else {
        qry =
            "select * from stop where stop = $3 arrival >= $1 and departure <= $2 and arrival <= $2 and departure >= $1";
        qryArr = [from, to, station];
    }

    pool.query(qry, qryArr, (err, rows) => {
        rows.rows.arrival = from;
        rows.rows.departure = to;
        return res.render("arrivals", {
            message: null,
            error: err,
            arrivals: rows.rows,
            user: true
        });
    });
});

router.post("/stops", (req, res) => {
    const { train_no } = req.body;
    const { pool } = req;

    pool.query(
        "select stop, arrival, departure from stop where train_no = $1",
        [train_no],
        (err, rows) => {
            if (!err) {
                rows.rows.train_no = train_no;
            }
            return res.render("list", {
                message: null,
                error: err,
                trains: rows.rows,
                user: true
            });
        }
    );
});

router.get("/list", (req, res) => {
    const { from, to, day } = req.query;
    const { pool } = req;

    pool.query(
        "select * from trains where src = $1 and dest = $2 and day = $3",
        [from, to, day],
        (err, rows) => {
            return res.render("search", {
                message: null,
                error: null,
                trains: rows.rows,
                user: true
            });
        }
    );
});

// router.get("/populate", async (req, res) => {
// const { pool } = req;

// pool.query("select * from trains", (err, rows) => {
// for (let t = 1; t < 20; ++t) {
// rows.rows.map(train => {
// pool.query(
// "insert into seat values($1, $2)",
// [train.train_no, t],
// (err, resp) => {}
// );
// });
// }
// });
// });

module.exports = router;
