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
            res.status(500).json(err.message);
        else {
            res.send(result);
        }
    });
}

/// Helper insert function, inserts to the database
function insert(res, table, args = []) {
    const query = `INSERT INTO ${table} SET ?`;
    db.query(query, args, (err, result) => {
        if (err)
            res.status(500).json(err.message);
        else {
            res.json({id: result.insertId});
        }
    });
}

/// Helper save function, executes given `query` with given `args`
/// Same as query function, but sets different status numbers
function save(res, query, args) {
    db.query(query, args, (err, result) => {
        if (err) {
            console.error(err);
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

/// Saves or edits given vacation in database
/// If given vacation contains id, it edits it, else adds
app.post("/api/vacation", (req, res) => {
    var vacation = {
        'title': req.body.title,
        'description': req.body.description,
        'start_date': req.body.start_date,
        'end_date': req.body.end_date,
        'image': req.body.image,
    };

    if (req.body.id) {
        sql = "UPDATE vacation SET ? WHERE id = ?";
        args = [vacation, req.body.id];
        save(res, sql, args);
    } else {
        insert(res, 'vacation', [vacation]);
    }

});

/// Deletes vacation by given ID
/// Deletes related items (trips and stops)
app.delete("/api/vacation", (req, res) => {
    if (!req.query.id) {
        res.status(400).send("No ID given to delete vacation");
        return;
    }

    sql = "DELETE FROM vacation WHERE id = ?";
    query(res, sql, [req.query.id]);
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
/// If `id` is set, it gets trip with given `id`
/// If `vacation_id` is set in URL, it gets all trips in given vacation
app.get("/api/trip", (req, res) => {
    var where = "";
    var args = [];
    if (req.query.id) {
        where = "WHERE id = ?";
        args = [req.query.id];
    } else if (req.query.vacation_id) {
        where = "WHERE vacation_id = ?";
        args = [req.query.vacation_id];
    }

    const sql = `SELECT * FROM trip ${where}`;
    query(res, sql, args);
});

/// Saves or edits given trip in database
/// If given trip contains id, it edits it, else adds
app.post("/api/trip", (req, res) => {
    var trip = {
        'vacation_id': req.body.vacation_id,
        'title': req.body.title,
        'description': req.body.description,
        'start_date': req.body.start_date,
        'end_date': req.body.end_date,
    };

    if (req.body.id) {
        sql = "UPDATE trip SET ? WHERE id = ?";
        args = [trip, req.body.id];
        save(res, sql, args);
    } else {
        insert(res, 'trip', [trip])
    }

});

/// Deletes trip by given ID
/// Deletes related items (stops)
app.delete("/api/trip", (req, res) => {
    if (!req.query.id) {
        res.status(400).send("No ID given to delete vacation");
        return;
    }

    sql = "DELETE FROM trip WHERE id = ?";
    query(res, sql, [req.query.id]);
});

/// Gets all stops
/// If `trip_id` is set in URL, it gets all stop in given trip
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

/// Saves or edits given stop in database
/// If given stop contains id, it edits it, else adds
app.post("/api/stop", (req, res) => {
    var stop = {
        'trip_id': req.body.trip_id,
        'title': req.body.title,
        'description': req.body.description,
        'image': req.body.image,
        'lat': req.body.lat,
        'lng': req.body.lng,
    };

    if (req.body.id) {
        sql = "UPDATE stop SET ? WHERE id = ?";
        args = [stop, req.body.id];
        save(res, sql, args);
    } else {
        insert(res, 'stop', [stop]);
    }

});

/// Deletes stop by given ID
app.delete("/api/stop", (req, res) => {
    if (!req.query.id) {
        res.status(400).send("No ID given to delete vacation");
        return;
    }

    sql = "DELETE FROM stop WHERE id = ?";
    query(res, sql, [req.query.id]);
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
