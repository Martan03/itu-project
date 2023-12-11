const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const fixtures = require('./fixtures');

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

/// This is TEMPORARY so we can easily create and fill database
app.get("/api/fill-tables", (_, res) => {
    db.query("DROP TABLE IF EXISTS stop");
    db.query("DROP TABLE IF EXISTS trip");
    db.query("DROP TABLE IF EXISTS vacation");

    fixtures.create_vacation_table();
    fixtures.create_trip_table();
    fixtures.create_stop_table();

    fixtures.add_vacations();
    fixtures.add_trips();
    fixtures.add_stops();

    res.json("Check out server console.")
});

/// Helper query function, executes given `query` with given `args`
/// Sends result to `res`
function query(res, query, args = []) {
    db.query(query, args, (err, result) => {
        if (err)
            res.status(500).json("Error occurred while executing query");
        else
            res.send(result);
    })
}

function save(res, query, args) {
    db.query(query, args, (err, result) => {
        if (err) {
            console.error(
                `Failed to add vacation '${vacation.title}': `
                + err.message
            );
            res.status(400).send(err.message);
        } else {
            res.status(201).send(result)
        }
    });
}

/// Gets all vacations
/// If `id` is set, it gets vacation with given id
/// If `query` is set in URL, it gets vacation containing `query` in title
/// `id` and `query` won't work together (`id` has priority)
app.get("/api/vacation", (req, res) => {
    var where = "ORDER BY title";
    var args = [];
    if (req.query.id) {
        where = "WHERE id = ?";
        args = [req.query.id];
    } else if (req.query.query) {
        where = `
            WHERE title LIKE ? OR description LIKE ?
            ORDER BY
                CASE
                    WHEN title LIKE ? THEN 0
                    ELSE 1
                END,
                title;
        `;
        args = [
            `%${req.query.query}%`,
            `%${req.query.query}%`,
            `%${req.query.query}%`
        ];
    }

    const sql = `SELECT * FROM vacation ${where}`;
    query(res, sql, args);
});

/// Saves given vacation to the database
app.post("/api/vacation", (req, res) => {
    const sql = "INSERT INTO vacation set ?";
    const args = [req.body];
    save(res, sql, args);
});

/// Gets past vacations
app.get("/api/vacation/past", (_, res) => {
    const date = new Date();
    const sql = "SELECT * FROM vacation WHERE end_date < ?";
    query(res, sql, [date]);
});

/// Gets upcoming vacations
app.get("/api/vacation/upcoming", (_, res) => {
    const date = new Date();
    const sql = "SELECT * FROM vacation WHERE end_date >= ?";
    query(res, sql, [date]);
});

/// Gets all trips
/// If vacation_id is set in URL, it gets all trips in given vacation
app.get("/api/trip", (req, res) => {
    var where = "";
    var args = [];
    if (req.query.vacation_id) {
        where = "WHERE vacation_id = ?";
        args = [req.query.vacation_id];
    }

    const sql = `SELECT * FROM trip ${where}`;
    query(res, sql, args);
});

/// Saves given trip to the database
app.post("/api/trip", (req, res) => {
    const sql = "INSERT INTO trip set ?";
    const args = [req.body];
    save(res, sql, args);
});

/// Gets all stops
/// If trip_id is set in URL, it gets all stop in given trip
app.get("/api/stop", (req, res) => {
    var where = "";
    var args = [];
    if (req.query.trip_id) {
        where = "WHERE trip_id = ?";
        args = [req.query.trip_id];
    }

    const sql = `SELECT * FROM stop ${where}`;
    query(res, sql, args);
});

app.post("/api/stop", (req, res) => {
    var sql = "INSERT INTO trip set ?";
    var args = [req.body];
    save(res, sql, args);
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
