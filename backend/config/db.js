/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

// Establishes database connection
const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "trip_planner",
});

module.exports = db;
