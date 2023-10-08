const express = require('express');
const db = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

function query(res, query, args = []) {
    db.query(query, args, (err, result) => {
        if (err)
            res.status(500).json(`Error occurred while executing query`);
        else
            res.send(result);
    })
}

/// Gets all trips
app.get("/api/trip", (req, res) => {
    query(res, "SELECT * FROM trip");
});

/// Gets past trips
app.get("/api/past", (req, res) => {
    const date = new Date();
    const sql = 'SELECT * FROM trip WHERE start_date < ?'
    query(res, sql, [date]);
})

/// Gets upcoming trips
app.get("/api/upcoming", (req, res) => {
    const date = new Date();
    const sql = 'SELECT * FROM trip WHERE start_date >= ?'
    query(res, sql, [date]);
})

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
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
