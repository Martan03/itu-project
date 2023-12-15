import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from 'moment';
import { DateRange } from './DateRange';
import { ReactComponent as TrashIcon } from '../icons/trash.svg';
import { saveTrip, deleteTrip } from "../Db";

/// Renders given trip and its stops
function Trip(props) {
    const [data, setData] = useState(props.item);
    const [savedData, setSavedData] = useState(props.item);
    const [anyChange, setAnyChange] = useState(false);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        setAnyChange(String(value) !== String(savedData[name]));
    }

    const inputConfirm = () => {
        if (anyChange) {
            props.setTrip(data);
            saveTrip(data);
            setSavedData(data);
            setAnyChange(false);
        }
    }

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
                            <h2>{data.title}</h2>
                        </div>
                        <p>{data.description}</p>
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
        console.log("removing ", t.id);
        setData(data.filter(i => i.id !== t.id));
        deleteTrip(t.id);
    };

    const setTrip = idx => t => {
        let trips = [...data];
        trips[idx] = t;
        setData(trips);
    }

    return (
        <>
            { data && (
                data.length ? (
                    data.map((item, idx) => (
                        <Trip
                            removeTrip={removeTrip}
                            setTrip={setTrip(idx)}
                            item={item}
                            key={item.id}
                            vacation_id={props.id}/>
                    ))
                ) : (
                    <h1>No vacation trips found...</h1>
                )
            )}
        </>
    );
}

export default TripList;
