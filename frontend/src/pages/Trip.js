import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import Layout from "../Layout";
import DateRange from "../components/DateRange";

/// Fetches data from API from given url
/// requires setData, setError, setLoading to set corresponding values
async function FetchApi(url, setData, setLoading, setError) {
    fetch(`http://localhost:3002/api${url}`)
        .then((response) => {
            if (!response.ok)
                throw new Error(`Error occurred: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            setData(data);
            setError(null);
        })
        .catch((err) => {
            setData(null);
            setError(err.message);
        })
        .finally(() => setLoading(false));
}

/// Renders details of the trip
function TripDetails(props) {
    return (
        <div className="vacation-header">
            <div className="vacation-header-content">
                <DateRange
                    start_date={props.trip.start_date}
                    end_date={props.trip.end_date}
                />
                <h1>{props.trip.title}</h1>
                <p>{props.trip.description}</p>
            </div>
        </div>
    )
}

/// Component to display trip stop
function Stop(props) {
    return (
        <div className="card stop">
            <img src={props.stop.image}
                    alt={props.stop.title + " picture"} />
            <div className="card-content">
                <h2>{props.stop.title}</h2>
                <p>{props.stop.description}</p>
            </div>
        </div>
    )
}

/// Renders given stops
function StopsList(props) {
    return props.stops.map(stop => (
        <Stop key={stop.id} stop={stop} />
    ));
}

function Trip(props) {
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    useEffect(() => {
        const fetchData = async () => {
            const url = 'http://localhost:3002/api';
            try {
                const [trip_res, stop_res] = await Promise.all([
                    fetch(`${url}/trip?id=${id}`).then(res => res.json()),
                    fetch(`${url}/stop?trip_id=${id}`).then(res => res.json())
                ]);

                setTrip(trip_res[0]);
                setStops(stop_res);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <Layout search={props.search}>
            { loading && <h2>Loading...</h2> }
            { error && <h2>Failed to load vacation</h2> }
            { trip && stops && (
                <>
                    <TripDetails trip={trip} />
                    <StopsList stops={stops} />
                </>
            )}
        </Layout>
    );
}

export default Trip;
