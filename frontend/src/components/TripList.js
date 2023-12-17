/**
 * ITU project
 *
 * Jakub Antonín Štigler <xstigl00>
 */

import { React, useState } from "react";
import { Link } from "react-router-dom";
import { DateRange } from './DateRange';
import { ReactComponent as TrashIcon } from '../icons/trash.svg';
import { saveTrip, deleteTrip } from "../Db";

/// converts meters to kilometers with only one decimal place
function toKm(m) {
    return Math.trunc(m / 100) / 10;
}

/// Gets human readable name of the type of the route
function getTravelTypeString(trip) {
    if (!trip.route_type) {
        return "Other";
    }
    switch (trip.route_type.split("_")[0]) {
    case "car":
        return "In car";
    case "foot":
        return "On foot";
    case "bike":
        return "On bike";
    default:
        return "Other";
    }
}

/// Renders given trip and its stops
function Trip(props) {
    const [data, setData] = useState(props.item);
    const [savedData, setSavedData] = useState(props.item);
    const [anyChange, setAnyChange] = useState(false);

    // universal function for changing the data
    const inputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        setAnyChange(String(value) !== String(savedData[name]));
    }

    // save the data to database
    const inputConfirm = () => {
        if (anyChange) {
            props.setTrip(data);
            saveTrip(data);
            setSavedData(data);
            setAnyChange(false);
        }
    }

    // remove trip
    const removeTrip = () => {
        if (props.removeTrip) {
            props.removeTrip(data);
        }
    }

    return (
        <div className="vacation">
            <div className="marker">
                <div className="marker-circle"></div>
                <div className="marker-line"></div>
            </div>
            <div className="data trip">
                <div className="trip-list-header">
                    <DateRange input
                        onChange={inputChange}
                        onBlur={inputConfirm}
                        values={[data.start_date, data.end_date]}/>
                    <button
                        onClick={removeTrip}
                        className="remove-trip-button">
                        <TrashIcon/>
                    </button>
                </div>
                <Link to={`/trip?id=${props.item.id}`} className="card trip">
                    <div className="card-content">
                        <div className="card-expand">
                            <h2>{data.title ?? "Unnamed trip"}</h2>
                            <p>{toKm(data.route_len ?? 0)} km</p>
                        </div>
                        <div className="card-expand">
                            <p>{data.description ?? "No description"}</p>
                            <p>{getTravelTypeString(data)}</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

/// Renders vacation trips list
function TripList(props) {
    let data = props.trips;
    let setData = props.setTrips;

    const removeTrip = (t) => {
        // remove the trip by filtering it out
        setData(data.filter(i => i.id !== t.id));
        deleteTrip(t.id);
    };

    const setTrip = idx => t => {
        // in order to set the trip at index, we need to copy the data because
        // `data` can be set only with the `setData` function
        let trips = [...data];
        trips[idx] = t;
        setData(trips);
    }

    return (
        <>
            { data && (
                data.length ? (
                    // iterate trough the trips and create card for each
                    data.map((item, idx) => (
                        <Trip
                            removeTrip={removeTrip}
                            setTrip={setTrip(idx)}
                            item={item}
                            key={item.id}
                            vacation_id={props.id}/>
                    ))
                ) : (
                    <></>
                )
            )}
        </>
    );
}

export default TripList;
