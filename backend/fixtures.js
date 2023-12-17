const db = require('./config/db');

const vacations = [
    {"id":"4","title":"Tatry","description":"Pojedeme se podívat do tater!!!","start_date":"2024-08-11","end_date":"2024-08-18","image":null}
]

const trips = [
    {"id":"3","vacation_id":"4","title":"Cesta tam","description":"Pojedeme autem","start_date":"2024-08-11","end_date":null,"route_type":"car_short","route_len":"388367"},
    {"id":"4","vacation_id":"4","title":"Výlet Široké sedlo","description":"Cesta do kopce a zase dolů","start_date":"2024-08-13","end_date":null,"route_type":"foot_fast","route_len":"15230"},
    {"id":"5","vacation_id":"4","title":"Výlet s výhledem do hor","description":"Není tak moc do kopce","start_date":"2024-08-14","end_date":null,"route_type":"foot_fast","route_len":"10253"},
    {"id":"6","vacation_id":"4","title":"Procházka po okolí","description":"Ještě není plně naplánováno","start_date":null,"end_date":null,"route_type":"foot_fast","route_len":"7691"}
]

const stops = [
    {"id":"3","trip_id":"3","title":"","description":"","image":null,"lat":"49.2612","lng":"16.5752"},
    {"id":"4","trip_id":"3","title":"","description":"","image":null,"lat":"49.2741","lng":"20.2511"},
    {"id":"5","trip_id":"4","title":"","description":"","image":null,"lat":"49.2726","lng":"20.2557"},
    {"id":"6","trip_id":"4","title":"","description":"","image":null,"lat":"49.238","lng":"20.2132"},
    {"id":"7","trip_id":"4","title":"","description":"","image":null,"lat":"49.2726","lng":"20.2558"},
    {"id":"8","trip_id":"5","title":"","description":"","image":null,"lat":"49.2727","lng":"20.2554"},
    {"id":"9","trip_id":"5","title":"","description":"","image":null,"lat":"49.2799","lng":"20.2673"},
    {"id":"10","trip_id":"5","title":"","description":"","image":null,"lat":"49.291","lng":"20.2623"},
    {"id":"11","trip_id":"5","title":"","description":"","image":null,"lat":"49.2819","lng":"20.2214"},
    {"id":"12","trip_id":"5","title":"","description":"","image":null,"lat":"49.276","lng":"20.2373"},
    {"id":"13","trip_id":"5","title":"","description":"","image":null,"lat":"49.2728","lng":"20.2554"},
    {"id":"14","trip_id":"6","title":"","description":"","image":null,"lat":"49.2727","lng":"20.2552"},
    {"id":"16","trip_id":"6","title":"","description":"","image":null,"lat":"49.2758","lng":"20.2347"},
    {"id":"17","trip_id":"6","title":"","description":"","image":null,"lat":"49.2738","lng":"20.229"},
    {"id":"18","trip_id":"6","title":"","description":"","image":null,"lat":"49.2643","lng":"20.237"},
    {"id":"20","trip_id":"6","title":"","description":"","image":null,"lat":"49.267","lng":"20.2487"},
    {"id":"21","trip_id":"6","title":"","description":"","image":null,"lat":"49.2695","lng":"20.266"},
    {"id":"22","trip_id":"6","title":"","description":"","image":null,"lat":"49.2727","lng":"20.2555"}
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
