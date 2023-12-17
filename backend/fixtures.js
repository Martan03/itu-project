/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

const db = require('./config/db');

const vacations = [
    {
        title: 'Japan is Awesome',
        description: 'Breathtaking vacation in worlds most beautiful country',
        start_date: '2024-08-08',
        end_date: '2024-10-08',
    },
    {
        title: "Tatry",
        description: "Pojedeme se podívat do tater!!!",
        start_date: "2024-08-11",
        end_date: "2024-08-18"
    },
    {
        title: "Malá fatra",
        description: "3 denní puťák!",
        start_date: "2024-07-10",
        end_date: "2024-07-12",
    }
];

const trips = [
    {
        vacation_id: 1,
        title: "City of Tokyo -> Kyoto",
        description: "We'll visit these places",
        start_date: "2024-08-08",
        end_date: "2024-09-08",
        route_type: "car_short",
    },
    {
        vacation_id: 1,
        title: "Wandering in the city",
        description: "See beauty of the city",
        start_date: "2024-09-08",
        end_date: "2024-10-08",
        route_type: "foot_fast",
    },
    {"vacation_id": 2,"title":"Cesta tam","description":"Pojedeme autem","start_date":"2024-08-11","end_date":null,"route_type":"car_short"},
    {"vacation_id": 2,"title":"Výlet Široké sedlo","description":"Cesta do kopce a zase dolů","start_date":"2024-08-13","end_date":null,"route_type":"foot_fast"},
    {"vacation_id": 2,"title":"Výlet s výhledem do hor","description":"Není tak moc do kopce","start_date":"2024-08-14","end_date":null,"route_type":"foot_fast"},
    {"vacation_id": 2,"title":"Procházka po okolí","description":"Ještě není plně naplánováno","start_date":null,"end_date":null,"route_type":"foot_fast"},
    {
        vacation_id: 3,
        title: "Cesta tam",
        description: "Vzít si pro jistotu občanky!",
        start_date: "2024-07-10",
        end_date: "2024-07-10",
        route_type: "car_fast_traffic",
    },
    {
        vacation_id: 3,
        title: "Výstup nahoru",
        description: "Vzít si hodně pití! Bude to náročný výstup",
        start_date: "2024-07-10",
        end_date: "2024-07-10",
        route_type: "foot_fast",
    },
    {
        vacation_id: 3,
        title: "To nejlepší!",
        description: "Tento den se půjde převázně po vrcholu. Pokud bude přát počasí, budou nádherné výhledy.",
        start_date: "2024-07-11",
        end_date: "2024-07-11",
        route_type: "foot_fast",
    },
    {
        vacation_id: 3,
        title: "Poslední den",
        description: "Příště to musí být delší!",
        start_date: "2024-07-12",
        end_date: "2024-07-12",
        route_type: "foot_fast",
    },
];

const stops = [
    {
        trip_id: 1,
        title: "First stop of the trip - Tokyo Downtown",
        description: "What to say more",
        image: null,
        lat: 35.6841,
        lng: 139.7565,
    },
    {
        trip_id: 1,
        title: "Second stop - Kyoto",
        description: "",
        image: null,
        lat: 35.019284,
        lng: 135.7621,
    },
    {
        trip_id: 2,
        title: "Nice view",
        description: "Take many pictures",
        image: null,
        lat: 35.018282,
        lng: 135.76264,
    },
    {
        trip_id: 2,
        title: "Lunch",
        description: "Dont forget to have enough cash ;-)",
        image: null,
        lat: 35.017615,
        lng: 135.77873887,
    },
    {"trip_id":"3","title":"","description":"","image":null,"lat":"49.2612","lng":"16.5752"},
    {"trip_id":"3","title":"","description":"","image":null,"lat":"49.2741","lng":"20.2511"},
    {"trip_id":"4","title":"","description":"","image":null,"lat":"49.2726","lng":"20.2557"},
    {"trip_id":"4","title":"","description":"","image":null,"lat":"49.238","lng":"20.2132"},
    {"trip_id":"4","title":"","description":"","image":null,"lat":"49.2726","lng":"20.2558"},
    {"trip_id":"5","title":"","description":"","image":null,"lat":"49.2727","lng":"20.2554"},
    {"trip_id":"5","title":"","description":"","image":null,"lat":"49.2799","lng":"20.2673"},
    {"trip_id":"5","title":"","description":"","image":null,"lat":"49.291","lng":"20.2623"},
    {"trip_id":"5","title":"","description":"","image":null,"lat":"49.2819","lng":"20.2214"},
    {"trip_id":"5","title":"","description":"","image":null,"lat":"49.276","lng":"20.2373"},
    {"trip_id":"5","title":"","description":"","image":null,"lat":"49.2728","lng":"20.2554"},
    {"trip_id":"6","title":"","description":"","image":null,"lat":"49.2727","lng":"20.2552"},
    {"trip_id":"6","title":"","description":"","image":null,"lat":"49.2758","lng":"20.2347"},
    {"trip_id":"6","title":"","description":"","image":null,"lat":"49.2738","lng":"20.229"},
    {"trip_id":"6","title":"","description":"","image":null,"lat":"49.2643","lng":"20.237"},
    {"trip_id":"6","title":"","description":"","image":null,"lat":"49.267","lng":"20.2487"},
    {"trip_id":"6","title":"","description":"","image":null,"lat":"49.2695","lng":"20.266"},
    {"trip_id":"6","title":"","description":"","image":null,"lat":"49.2727","lng":"20.2555"},
    {
        trip_id: 7,
        title: "Start",
        description: "",
        lat: "49.2264",
        lng: "16.5962",
    },
    {
        trip_id: 7,
        title: "Cíl",
        description: "",
        lat: "49.178",
        lng: "18.867",
    },
    {
        trip_id: 8,
        title: "Start",
        description: "Tady musíme opustit auto",
        lat: "49.1781",
        lng: "18.8671",
    },
    {
        trip_id: 8,
        title: "Zřícenina",
        description: "Poměrně malá, ale hezký výhled. Vstupné dobrovolné.",
        lat: "49.1779",
        lng: "18.8906",
    },
    {
        trip_id: 8,
        title: "Chata pod Suchým",
        description: "Ubytování, placeno předem. Mají halušky! :)",
        lat: "49.1766",
        lng: "18.935",
    },
    {
        trip_id: 9,
        title: "Chata pod Suchým",
        description: "",
        lat: "49.1767",
        lng: "18.9351",
    },
    {
        trip_id: 9,
        title: "Velký Kriváň",
        description: "",
        lat: "49.1876",
        lng: "19.0309",
    },
    {
        trip_id: 9,
        title: "Chata pod Chlebom",
        description: "Ubytování, placeno předem.",
        lat: "49.181",
        lng: "19.0498",
    },
    {
        trip_id: 10,
        title: "Chata pod Chlebom",
        description: "",
        lat: "49.181",
        lng: "19.0498",
    },
    {
        trip_id: 10,
        title: "Velký Rozsutec",
        description: "Řetězama na vrchol, to bude zábava! Pokud bude pršet, obejít!",
        lat: "49.2315",
        lng: "19.0986",
    },
    {
        trip_id: 10,
        title: "Vstup do Janošikových dier",
        description: "Žebříky sem, žebříky tam a všude samý vodopád",
        lat: "49.2416",
        lng: "19.0928",
    },
    {
        trip_id: 10,
        title: "Konec :(",
        description: "Odtud ještě naplánovat odjezd.",
        lat: "49.2574",
        lng: "19.0668",
    },
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
