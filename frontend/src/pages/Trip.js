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
    const [key, setKey] = useState('');
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
            trip_id: props.trip.id,
        }
        saveStop(newStop).then((id) => {
            newStop.id = id
            props.stops.setStops(prevStops => [
                ...prevStops,
                newStop,
            ]);
        });
    }

    const setLen = (len) => {
        if (props.trip.trip.route_len !== len) {
            props.trip.setTrip({...props.trip.trip, route_len: len});
            saveTrip({...props.trip.trip, route_len: len});
        }
    }

    return (
        <Map
            key={`${coords.length}${props.trip.trip.route_type}`}
            size={{height: '100%', width: '100%'}}
            {...(coords.length >= 2 && {
                routes: [{
                    showRoute: true,
                    travelType: props.trip.trip.route_type,
                    coords: coords,
                    setLen: setLen,
                }],
            })}
            lang={'cs'}
            onClick={addStop}
        />
    )
}

/// Renders details of the trip
function TripDetails(props) {
    const len = props.trip.data.route_len ?? 0;

    const typeChange = (e) => {
        props.trip.setData({...props.trip.data, route_type: e.target.value});
        saveTrip({...props.trip.data, route_type: e.target.value});
    }

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
                <p>Trip distance: <b>{len / 1000} km</b></p>
                <p>Travel type:
                    <select onChange={typeChange}
                            value={props.trip.data.route_type}>
                        <option value="car_fast">Car fast</option>
                        <option value="car_fast_traffic">
                            Car fast traffic
                        </option>
                        <option value="car_short">Car short</option>
                        <option value="foot_fast">Foot</option>
                        <option value="bike_road">Road bike</option>
                        <option value="bike_mountain">Mountain bike</option>
                    </select>
                </p>
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
                        <RenderMap
                            stops={{stops, setStops}}
                            trip={{trip, setTrip}}
                        />
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
