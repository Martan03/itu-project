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
import { getTripWithStops, saveTrip, saveStop, deleteStop } from "../Db.js";
import Error from "../components/Error.js";
import { DescInput, TitleInput } from "../components/Input";

import { ReactComponent as BinIcon } from '../icons/bin.svg';

/// Renders map with route given by stops
function RenderMap(props) {
    const [coords, setCoords] = useState([]);
    useEffect(() => {
        // Converts stops coordinates to coordinates array
        setCoords(props.stops.stops.map(stop => (
            [stop.lng, stop.lat]
        )));
    }, [props.stops.stops]);

    // Adds new stop and saves it
    const addStop = (lngLat) => {
        var newStop = {
            id: null,
            title: '',
            description: '',
            lng: lngLat.lng,
            lat: lngLat.lat,
            trip_id: props.id,
        }
        saveStop(newStop).then((id) => {
            newStop.id = id
            props.stops.setStops(prevStops => [
                ...prevStops,
                newStop,
            ]);
        });
    }

    return (
        <Map
            key={coords.length}
            size={{height: '100%', width: '100%'}}
            {...(coords.length >= 2 && {
                routes: [{
                    showRoute: true,
                    travelType: 'car_fast',
                    coords: coords
                }]
            })}
            lang={'cs'}
            onClick={addStop}
        />
    )
}

/// Renders details of the trip
function TripDetails(props) {
    return (
        <div className="vacation-header">
            <div className="vacation-header-content trip">
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
    // Sets stops with update stop value
    const setData = (val) => {
        var arr = [...props.stops.stops];
        arr[props.index] = val;
        props.stops.setStops(arr);
    }

    // Saves stop and sets id when created
    const save = (stop) => {
        saveStop(stop).then((id) => {
            if (!id)
                return;
            stop.id = id;
            setData(stop);
        });
    }

    // Deletes stop
    const delStop = () => {
        deleteStop(props.stop.id)
        const stops = [...props.stops.stops];
        stops.splice(props.index, 1);
        props.stops.setStops(stops);
    }

    return (
        <div className="card stop">
            <img src={props.stop.image}
                 alt={props.stop.title + " picture"} />
            <div className="card-content">
                <BinIcon className="remove-btn" onClick={delStop} />
                <TitleInput
                    data={{data: props.stop, setData}}
                    save={save}
                    small={true}
                />
                <DescInput
                    data={{data: props.stop, setData}}
                    save={save}
                />
            </div>
        </div>
    )
}

/// Renders given stops
function StopsList(props) {
    return props.stops.stops.map((stop, index) => (
        <Stop
            key={index}
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
                        <RenderMap stops={{stops, setStops}} id={id} />
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
