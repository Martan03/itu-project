const db = require('./config/db');

/// Creates new vacation table in the database
function create_vacation_table() {
    const sql = `
        CREATE TABLE vacation (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT,
            description TEXT,
            start_date DATE,
            end_date DATE,
            image TEXT
        );
    `;
    db.query(sql, (err, result) => {
        if (err)
            console.error('Error creating table: `vacation`');
        else
            console.log('Table `vacation` created successfully');
    });
}

/// Creates new trip table in the database
function create_trip_table() {
    const sql = `
        CREATE TABLE trip (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vacation_id INT,
            title TEXT,
            description TEXT,
            map TEXT,
            start_date DATE,
            end_date DATE,
            FOREIGN KEY (vacation_id) REFERENCES vacation(id)
        );
    `;
    db.query(sql, (err, result) => {
        if (err)
            console.error('Error creating table: `trip`');
        else
            console.log('Table `trip` created successfully');
    });
}

/// Creates new stop table in the database
function create_stop_table() {
    const sql = `
        CREATE TABLE stop (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vacation_id INT,
            title TEXT,
            description TEXT,
            image TEXT,
            FOREIGN KEY (vacation_id) REFERENCES trip(id)
        );
    `;
    db.query(sql, (err, result) => {
        if (err)
            console.error('Error creating table: `stop`');
        else
            console.log('Table `stop` created successfully');
    });
}

module.exports = {
    create_vacation_table,
    create_trip_table,
    create_stop_table,
}
