/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

const db = require('./config/db');

const vacations = [
    {
        title: 'Paris vacation',
        description: 'This should be description of the vacation in Paris',
        start_date: '2024-01-10',
        end_date: '2024-01-12',
        image: 'paris.jpg',
    },
    {
        title: 'Berlin!',
        description: 'Fantastic vacation in Berlin',
        start_date: '2023-10-2',
        end_date: '2023-10-4',
        image: 'berlin.jpg',
    },
];

const trips = [
    {
        vacation_id: 1,
        title: "First trip",
        description: "We'll visit these places",
        start_date: "2023-01-10",
        end_date: "2023-01-11",
    },
    {
        vacation_id: 1,
        title: "Second trip",
        description: "This trip we'll do something else",
        start_date: "2023-01-11",
        end_date: "2023-01-12",
    }
];

const stops = [
    {
        trip_id: 1,
        title: "First stop of the trip",
        description: "We'll go to this place and pay this amount to enter",
        image: "paris.jpg",
        lat: 48.8583,
        lng: 2.2945,
    },
    {
        trip_id: 1,
        title: "Second stop",
        description: "We'll have to be there in this time so it's not closed",
        image: "berlin.jpg",
        lat: 52.52437,
        lng: 13.41053,
    }
]

/// Creates new vacation table in the database
function create_vacation_table() {
    const sql = `
        CREATE TABLE vacation (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT,
            description TEXT,
            start_date DATE NULL,
            end_date DATE NULL,
            image TEXT
        );
    `;
    db.query(sql, (err, _) => {
        if (err)
            console.error('Failed to create table `vacation`: ' + err.message);
        else
            console.log('Table `vacation` created successfully');
    });
}

/// Adds vacations to the database
function add_vacations() {
    for (let vacation of vacations) {
        db.query("INSERT INTO vacation set ?", vacation, (err, _) => {
            if (err) {
                console.error(
                    `Failed to add vacation '${vacation.title}: `
                    + err.message
                );
            } else {
                console.log(`Vacation '${vacation.title}' added`);
            }
        });
    }
}

/// Creates new trip table in the database
function create_trip_table() {
    const sql = `
        CREATE TABLE trip (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vacation_id INT,
            title TEXT,
            description TEXT,
            start_date DATE NULL,
            end_date DATE NULL,
            route_type TEXT,
            route_len INT UNSIGNED,
            FOREIGN KEY (vacation_id) REFERENCES vacation(id) ON DELETE CASCADE
        );
    `;
    db.query(sql, (err, _) => {
        if (err)
            console.error('Failed to create table `trip`: ' + err.message);
        else
            console.log('Table `trip` created successfully');
    });
}

/// Adds trips to the database
function add_trips() {
    for (let trip of trips) {
        db.query("INSERT INTO trip set ?", trip, (err, _) => {
            if (err) {
                console.error(
                    `Failed to add trip '${trip.title}': `
                    + err.message
                );
            } else {
                console.log(`Trip '${trip.title}' added`);
            }
        });
    }
}

/// Creates new stop table in the database
function create_stop_table() {
    const sql = `
        CREATE TABLE stop (
            id INT AUTO_INCREMENT PRIMARY KEY,
            trip_id INT,
            title TEXT,
            description TEXT,
            image TEXT,
            lat FLOAT,
            lng FLOAT,
            FOREIGN KEY (trip_id) REFERENCES trip(id) ON DELETE CASCADE
        );
    `;
    db.query(sql, (err, _) => {
        if (err)
            console.error('Failed to create table `stop`: ' + err.message);
        else
            console.log('Table `stop` created successfully');
    });
}

/// Adds stops to the database
function add_stops() {
    for (let stop of stops) {
        db.query("INSERT INTO stop set ?", stop, (err, _) => {
            if (err) {
                console.error(
                    `Failed to add stop '${stop.title}': `
                    + err.message
                );
            } else {
                console.log(`Stops '${stop.title}' added`);
            }
        });
    }
}

module.exports = {
    create_vacation_table,
    add_vacations,
    create_trip_table,
    add_trips,
    create_stop_table,
    add_stops,
}
