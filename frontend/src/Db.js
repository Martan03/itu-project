/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 * Jakub Antonín Štigler <xstigl00>
 */

import moment from 'moment';

const API_URL = "http://localhost:3002";

// Martin Slezák <xsleza26>
/**
 * Fetches data from the API
 * @param {function} setData - sets variable value to contain fetched value
 * @param {function} setLoading - sets loading value
 * @param {function} setErr - sets error value
 * @param {string} url - url to fetch data from
 */
function fetchAPI(setData, setLoading, setErr, url) {
    fetch(`${API_URL}${url}`)
        .then((res) => {
            if (!res.ok)
                throw new Error(res.status);
            return res.json();
        })
        .then(data => {
            setData(data);
        })
        .catch((err) => {
            setData(null);
            setErr(err.message);
        })
        .finally(setLoading(false));
}

// Martin Slezák <xsleza26>
/**
 * Sends data to the database to be saved
 * @param {Object} data - data to be saved
 * @param {String} url - URL to the API endpoint
 * @return ID of the created item
 */
function saveAPI(data, url) {
    return fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (!res.ok)
                throw new Error(res.status);
            return res.json();
        })
        .then(data => data.id)
        .catch(err => console.error(err.message));
}

// Martin Slezák <xsleza26>
/**
 * Deletes from the database
 * @param {Number} id - id of the item to be deleted
 * @param {String} url - url of the API endpoint
 */
function deleteAPI(id, url) {
    fetch(`${API_URL}${url}?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then((res) => {
            if (!res.ok)
                throw new Error(res.status);
        })
        .catch(err => console.error(err.message));
}

// Martin Slezák <xsleza26>
/**
 * Gets all vacations from the database
 * @param {function} setData - sets variable value to contain vacations
 * @param {function} setLoading - sets loading value
 * @param {function} setErr - sets error value
 * @param {number} time - if negative -> past, positive -> upcoming, else all
 * @param {string} search - contains search query to get vacation with
 */
function getVacations(setData, setLoading, setErr, time = 0, search) {
    var url = "/api/vacation";
    if (time < 0)
        url = "/api/vacation/past";
    else if (time > 0)
        url = "/api/vacation/upcoming"

    if (search)
        url += `?query=${search}`;

    fetchAPI(setData, setLoading, setErr, url);
}

// Martin Slezák <xsleza26>
/**
 * Gets trip with its stops from the database
 * @param {function} setTrip - sets trip
 * @param {function} setStops - sets stops
 * @param {function} setLoading - sets loading value
 * @param {function} setErr - set error value
 * @param {number} id - trip id
 */
function getTripWithStops(setTrip, setStops, setLoading, setErr, id) {
    const fetchData = async () => {
        try {
            const [trip_res, stop_res] = await Promise.all([
                fetch(`${API_URL}/api/trip?id=${id}`)
                    .then(res => res.json()),
                fetch(`${API_URL}/api/stop?trip_id=${id}`)
                    .then(res => res.json())
            ]);

            setTrip(trip_res[0]);
            setStops(stop_res);
            setLoading(false);
        } catch (err) {
            setTrip(null);
            setStops(null);
            setLoading(false);
            setErr(err.message);
        }
    }
    fetchData();
}

function getVacation(id, setData, setLoading, setErr) {
    fetch(`${API_URL}/api/vacation?id=${id}`)
        .then((res) => {
            if (!res.ok)
                throw new Error(res.status);
            return res.json();
        })
        .then(data => {
            setData(data[0]);
        })
        .catch((err) => {
            setData(null);
            setErr(err.message);
        })
        .finally(setLoading(false));
}

// Jakub Antonín Štigler <xstigl00>
/**
 * Gets vacation with its trips from the database
 * @param {function} setVacation - sets vacation
 * @param {function} setTrips - sets trips
 * @param {function} setLoading - sets loading value
 * @param {function} setErr - set error value
 * @param {number} id - vacation id
 */
function getVacationWithTripsAndStops(
    setVacation,
    setTrips,
    setLoading,
    setErr,
    id
) {
    const fetchData = async () => {
        try {
            const [vac_res, trip_res] = await Promise.all([
                fetch(`${API_URL}/api/vacation?id=${id}`)
                    .then(res => res.json()),
                fetch(`${API_URL}/api/trip?vacation_id=${id}`)
                    .then(res => res.json())
            ]);

            const trips = await Promise.all(trip_res.map(t => {
                return fetch(`${API_URL}/api/stop?trip_id=${t.id}`)
                    .then(res => res.json());
            }));

            setVacation(vac_res[0]);
            setTrips(trip_res.map((t, i) => ({...t, stops: trips[i]})));
            setLoading(false);
        } catch (err) {
            setVacation(null);
            setTrips([]);
            setLoading(false);
            setErr(err.message);
        }
    }
    fetchData();
}

// Martin Slezák <xsleza26>
/**
 * Saves given vacation to the database
 * @param {Object} vacation - vacation to be saved
 * @return ID of the created vacation
 */
function saveVacation(vacation) {
    if (vacation.start_date)
        vacation.start_date = moment(vacation.start_date).format('YYYY-MM-DD');
    if (vacation.end_date)
        vacation.end_date = moment(vacation.end_date).format('YYYY-MM-DD');

    return saveAPI(vacation, "/api/vacation");
}

// Martin Slezák <xsleza26>
/**
 * Saves given trip to the database
 * @param {Object} trip - trip to be saved
 * @return ID of the created trip
 */
function saveTrip(trip) {
    if (trip.start_date)
        trip.start_date = moment(trip.start_date).format('YYYY-MM-DD');
    if (trip.end_date)
        trip.end_date = moment(trip.end_date).format('YYYY-MM-DD');

    return saveAPI(trip, "/api/trip");
}

// Martin Slezák <xsleza26>
/**
 * Saves given stop to the database
 * @param {Object} stop - stop to be saved
 * @return ID of the created stop
 */
function saveStop(stop) {
    return saveAPI(stop, "/api/stop");
}

// Martin Slezák <xsleza26>
/**
 * Deletes vacation from the database
 * @param {Number} id - id of the vacation to be removed
 */
function deleteVacation(id) {
    deleteAPI(id, "/api/vacation");
}

// Martin Slezák <xsleza26>
/**
 * Deletes trip from the database
 * @param {Number} id - id of the trip to be removed
 */
function deleteTrip(id) {
    deleteAPI(id, "/api/trip");
}

// Martin Slezák <xsleza26>
/**
 * Deletes stop from the database
 * @param {Number} id - id of the stop to be removed
 */
function deleteStop(id) {
    deleteAPI(id, "/api/stop");
}

/**
 * Uploads file to the server
 * @param {FormData} img - form data containing image to be uplaoded
 * @returns image name on the server
 */
function uploadImage(img) {
    return fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: img,
    })
        .then(res => {
            if (!res.ok)
                throw new Error(res.status);
            return res.json();
        })
        .then(data => data.filename)
        .catch(err => console.error(err.message));
}

export {
    getVacations,
    getTripWithStops,
    getVacationWithTripsAndStops,
    getVacation,
    saveVacation,
    saveTrip,
    saveStop,
    deleteVacation,
    deleteTrip,
    deleteStop,
    uploadImage,
}
