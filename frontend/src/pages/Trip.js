/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Layout from "../Layout";
import DateRange from "../components/DateRange";
import Map from "../components/Map.js";
import { getTripWithStops } from "../Db.js";
import Error from "../components/Error.js";

/// Renders map with route given by stops
function RenderMap(props) {
    // Gets stops coordinates
    const coords = props.stops.map(stop => (
        [stop.lng, stop.lat]
    ));

    return (
        <Map
            size={{height: '100%', width: '100%'}}
            showRoute={true}
            {...(coords.length >= 2 && {
                coordsStart: coords[0],
                coordsEnd: coords[coords.length - 1],
                travelType: 'car_fast'
            })}
            lang={'cs'}
            waypointsArr={coords.slice(1, -1)}
        />
    )
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

/// Renders trip page with its stops
function Trip(props) {
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    // Gets trip id from the url
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    // Redirects to error page when no ID set
    const nav = useNavigate();

    // Loads trip with its stops
    useEffect(() => {
        getTripWithStops(setTrip, setStops, setLoading, setErr, id);
    }, [id, nav]);

    // Redirects to 404 when no trip was found
    useEffect(() => {
        if (!trip && !loading)
            nav('/404');
    }, [trip, loading, nav]);

    return (
        <Layout search={props.search} menu={props.menu}>
            { loading && <h2>Loading...</h2> }
            { err && <Error /> }
            { trip && stops && (
                <div className="trip-layout">
                    <div className="trip-map">
                        <RenderMap stops={stops} />
                    </div>
                    <div className="trip-layout-details">
                        <TripDetails trip={trip} />
                        <StopsList stops={stops} />
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Trip;
