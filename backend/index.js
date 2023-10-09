const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const fixtures = require('./fixtures');

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

/// This is TEMPORARY so we can easily create and fill database
app.get("/api/create-tables", (req, res) => {
    fixtures.create_vacation_table();
    fixtures.create_trip_table();
    fixtures.create_stop_table();

    res.json('Check out server console.');
});

app.get("/api/fill-tables", (req, res) => {
    fixtures.add_vacations();

    res.json('Check out server console.')
});

/// Helper query function, executes given `query` with given `args`
/// Sends result to `res`
function query(res, query, args = []) {
    db.query(query, args, (err, result) => {
        if (err)
            res.status(500).json(`Error occurred while executing query`);
        else
            res.send(result);
    })
}

/// Gets all vacations
app.get("/api/vacation", (req, res) => {
    query(res, "SELECT * FROM vacation");
});

/// Gets past vacations
app.get("/api/vacation/past", (req, res) => {
    const date = new Date();
    const sql = 'SELECT * FROM vacation WHERE end_date < ?'
    query(res, sql, [date]);
});

/// Gets upcoming vacations
app.get("/api/vacation/upcoming", (req, res) => {
    const date = new Date();
    const sql = 'SELECT * FROM vacation WHERE end_date >= ?'
    query(res, sql, [date]);
});

/// Gets all trips
/// If vacation_id is set in URL, it gets all trips in given vacation
app.get("/api/trip", (req, res) => {
    var where = "";
    var args = [];
    if (req.query.vacation_id) {
        where = "WHERE vacation_id = ?"
        args = [req.query.vacation_id];
    }

    const sql = `SELECT * FROM trip ${where}`;
    query(res, sql, args);
});

/// Gets all stops
/// If trip_id is set in URL, it gets all stop in given trip
app.get("/api/stop", (req, res) => {
    var where = "";
    var args = [];
    if (req.query.trip_id) {
        where = "WHERE trip_id = ?"
        args = [req.query.trip_id];
    }

    const sql = `SELECT * FROM stop ${where}`;
    query(res, sql, args);
});

app.post("/api/trip/manage", (req, res) => {
    let data = {
        title: req.body.title,
        description: req.body.description,
        start_date: req.body.start_date,
        end_data: req.body.end_date,
        image: req.body.image,
    };

    db.query("INSERT INTO trip set ?", data, (err, result) => {
        if (err) {
            res.status(400).json('Failed to add a trip.');
        } else {
            res.status(200).json('Trip added successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
