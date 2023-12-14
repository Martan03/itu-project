/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Layout from "../Layout";
import { DateRangeInput } from "../components/DateRange.js";
import Map from "../components/Map.js";
import { getTripWithStops, saveTrip, saveStop } from "../Db.js";
import Error from "../components/Error.js";
import { DescInput, TitleInput } from "../components/Input";

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
                <DateRangeInput data={props.trip} save={saveTrip} />
                <TitleInput
                    data={props.trip}
                    save={saveTrip}
                />
                <DescInput
                    data={props.trip}
                    save={saveTrip}
                />
            </div>
        </div>
    )
}

/// Component to display trip stop
function Stop(props) {
    const [stop, setStop] = useState(props.stop);

    useEffect(() => {
        setStop(props.stop);
    }, [props.stop])

    const setData = (val) => {
        setStop(val);

        var arr = props.stops.stops;
        arr[props.index] = val;
        props.stops.setStops(arr);
    }

    return (
        <div className="card stop">
            <img src={props.stop.image}
                 alt={props.stop.title + " picture"} />
            <div className="card-content">
                <TitleInput
                    data={{data: stop, setData}}
                    save={saveStop}
                    small={true}
                />
                <DescInput
                    data={{data: stop, setData}}
                    save={saveStop}
                />
            </div>
        </div>
    )
}

/// Renders given stops
function StopsList(props) {
    return props.stops.stops.map((stop, index) => (
        <Stop
            key={stop.id}
            stop={stop}
            stops={props.stops}
            index={index}
        />
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
        if (!trip && !loading && !err)
            nav('/404');
    }, [trip, loading, err, nav]);

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
                        <TripDetails trip={{data: trip, setData: setTrip}} />
                        <StopsList stops={{stops, setStops}} />
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Trip;
