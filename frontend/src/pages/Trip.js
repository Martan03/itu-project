/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 * Tomáš Daniel <xdanie14>
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Layout from "../Layout";
import { DateRangeInput } from "../components/DateRange.js";
import Map from "../components/Map.js";
import { getTripWithStops, saveTrip, saveStop, deleteStop, uploadImage } from "../Db.js";
import Error from "../components/Error.js";
import { DescInput, TitleInput } from "../components/Input";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ReactComponent as TrashIcon } from '../icons/trash.svg';
import Image from "../components/Image.js";

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
            stop_order: props.stops.stops.length,
            trip_id: props.trip.trip.id,
        }
        saveStop(newStop).then((id) => {
            newStop.id = id
            props.stops.setStops(prevStops => [
                ...prevStops,
                newStop,
            ]);
        });
    }

    // Sets length of the trip
    const setLen = (len) => {
        if (props.trip.trip.route_len !== len) {
            props.trip.setTrip({...props.trip.trip, route_len: len});
            saveTrip({...props.trip.trip, route_len: len});
        }
    }

    return (
        <Map
            key={`${JSON.stringify(coords)}${props.trip.trip.route_type}`}
            size={{height: '100%', width: '100%'}}
            {...(coords.length >= 2 && {
                routes: [{
                    showRoute: true,
                    travelType: props.trip.trip.route_type,
                    coords: coords,
                    setLen: setLen,
                    setTime: props.setTime,
                }],
                addMarkers: true,
                markersArr: coords,
            })}
            lang={'cs'}
            onClick={addStop}
        />
    )
}

/// Renders details of the trip
function TripDetails(props) {
    const len = props.trip.data.route_len ?? 0;

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600)
        const minutes = Math.floor((seconds % 3600) / 60);

        const dayStr = days ? `${days} days ` : '';
        const hour = String(hours).padStart(2, '0');
        const min = String(minutes).padStart(2, '0');

        return `${dayStr}${hour}:${min}`;
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
                <p>Trip time: <b>{formatTime(props.time)}</b></p>
                <RouteTypeSelect trip={props.trip} />
            </div>
        </div>
    )
}

/// Renders route type selector
function RouteTypeSelect(props) {
    // Changes route type of the trip
    const typeChange = (e) => {
        props.trip.setData({...props.trip.data, route_type: e.target.value});
        saveTrip({...props.trip.data, route_type: e.target.value});
    }

    return (
        <p>
            Travel type:
            <select className="route-type-select" name="type-select"
                    onChange={typeChange}
                    value={props.trip.data.route_type ?? 'car_fast'}>
                <option value="car_fast">Fastest route</option>
                <option value="car_fast_traffic">Avoid traffic</option>
                <option value="car_short">Shortest route</option>
                <option value="foot_fast">By foot</option>
                <option value="bike_road">Road bike</option>
                <option value="bike_mountain">Mountain bike</option>
            </select>
        </p>
    )
}

/// Component to display trip stop
function Stop(props) {
    /* Tomáš Daniel <xdanie14> */
    // Defines drag and drop
    const [, drag] = useDrag({
        type: 'STOP',
        item: { index: props.index },
    });
    const [, drop] = useDrop({
        accept: 'STOP',
        hover: (item) => {
            if (item.index !== props.index) {
                moveStop(item.index, props.index);
                item.index = props.index;
            }
        },
    });
    /* ********************** */

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

    // Handles new picture upload
    const fileChange = (e) => {
        const data = new FormData();
        data.append('image', e.target.files[0]);
        uploadImage(data).then(img => {
            console.log(img);
            var arr = [...props.stops.stops];
            arr[props.index].image = img;
            props.stops.setStops(arr);
            saveStop(arr[props.index]);
        });
    }

    /* Tomáš Daniel <xdanie14> */
    const moveStop = (from, to) => {
        var stops = [...props.stops.stops];
        const [movedStop] = stops.splice(from, 1);
        stops.splice(to, 0, movedStop);
        stops = stops.map((stop, index) => {
            const updatedStop = {
                ...stop,
                stop_order: index,
            };
            if (from < to && index >= from && index <= to)
                saveStop(updatedStop);
            else if (to < from && index >= to && index <= from)
                saveStop(updatedStop);
            return updatedStop;
        });
        props.stops.setStops(stops);
    }
    /* ********************** */

    return (
        <div className="card stop" ref={(node) => drag(drop(node))}>
            <label htmlFor={`stop-file-${props.index}`}>
                <Image
                    src={props.stop.image}
                    alt={props.stop.title + " picture"}
                />
            </label>
            <input type="file" accept="image/*"
                className="stop-file-input"
                id={`stop-file-${props.index}`}
                capture="camera"
                onChange={fileChange} />
            <div className="card-content">
                <button
                    onClick={delStop}
                    className="remove-btn">
                    <TrashIcon/>
                </button>
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
    return (
        <DndProvider backend={HTML5Backend}>
            {props.stops.stops.map((stop, index) => (
                <Stop
                    key={index}
                    stop={stop}
                    stops={props.stops}
                    index={index}
                />
            ))}
        </DndProvider>
    );
}

/// Renders trip page with its stops
function Trip(props) {
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const [time, setTime] = useState(0);

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
                            setTime={setTime}
                        />
                    </div>
                    <div className="trip-layout-details">
                        <TripDetails
                            trip={{data: trip, setData: setTrip}}
                            time={time}
                        />
                        <StopsList stops={{stops, setStops}} />
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Trip;
