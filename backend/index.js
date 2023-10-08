const express = require('express');
const db = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

app.get("/api/trip", (req, res) => {
    db.query("SELECT * FROM trip", (err, result) => {
        if (err)
            console.log(err);
        res.send(result);
    })
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
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
