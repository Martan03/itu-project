import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Layout from "../Layout";
import DateRange from "../components/DateRange";
import Map from "../components/Map.js";

/// Renders map with route given by stops
function RenderMap(props) {
    const coords = props.stops.map(stop => (
        [stop.lng, stop.lat]
    ));

    if (coords.length < 2)
        return;

    return (
        <Map
            size={{height: '450px', width: '100%'}}
            showRoute={true}
            coordsStart={coords[0]}
            coordsEnd={coords[coords.length - 1]}
            travelType={'car_fast'}
            lang={'cs'}
            waypointsArr={coords.slice(1, -1)}
        />
    )
}

/// Renders details of the trip
function TripDetails(props) {
    return (
        <div className="vacation-header trip">
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

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    const nav = useNavigate();

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
            } catch (_) {
                nav(`/500`);
            }
        }

        fetchData();
    }, [id, nav]);

    return (
        <Layout search={props.search} menu={props.menu}>
            { loading && <h2>Loading...</h2> }
            { trip && stops && (
                <>
                    <RenderMap stops={stops} />
                    <TripDetails trip={trip} />
                    <StopsList stops={stops} />
                </>
            )}
        </Layout>
    );
}

export default Trip;
