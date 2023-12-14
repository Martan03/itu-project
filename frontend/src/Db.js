/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import moment from 'moment';

const API_URL = "http://localhost:3002";

/**
 * Fetches data from the API
 * @param {function} setData - sets variable value to contain fetched value
 * @param {function} setLoading - sets loading value
 * @param {function} setErr - sets error value
 * @param {function} url - url to fetch data from
 */
function fetchAPI(setData, setLoading, setErr, url) {
    fetch(`${API_URL}${url}`)
        .then((res) => {
            if (!res.ok)
                throw new Error(res.status);
            return res.json();
        })
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setData(null);
            setErr(err.message);
        })
        .finally(() => setLoading(false));
}

/**
 * Sends data to the database to be saved
 * @param {Object} data - data to be saved
 * @param {String} url - URL to the API endpoint
 */
function saveAPI(data, url) {
    fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (!res.ok)
                throw new Error(res.status);
        })
        .catch((err) => {
            console.error(err);
        })
}

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

/**
 * Saves given trip to the database
 * @param {Object} trip - trip to be saved
 */
function saveTrip(trip) {
    trip.start_date = moment(trip.start_date).format('YYYY-MM-DD HH:mm:ss');
    trip.end_date = moment(trip.end_date).format('YYYY-MM-DD HH:mm:ss');

    saveAPI(trip, "/api/trip");
}

/**
 * Saves given stop to the database
 * @param {Object} stop - stop to be saved
 */
function saveStop(stop) {
    stop.start_date = moment(stop.start_date).format('YYYY-MM-DD');
    stop.end_date = moment(stop.end_date).format('YYYY-MM-DD');

    saveAPI(stop, "/api/stop");
}

export {
    getVacations,
    getTripWithStops,
    saveTrip,
    saveStop,
}
