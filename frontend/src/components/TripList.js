import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from 'moment';
import { DateRange } from './DateRange';
import { ReactComponent as TrashIcon } from '../icons/trash.svg';
import { saveTrip, deleteTrip } from "../Db";

/// Fetches data from API from given url
/// requires setData, setError, setLoading to set corresponding values
async function FetchApi(url, setData, setLoading, nav) {
    fetch(`http://localhost:3002/api${url}`)
        .then((response) => {
            if (!response.ok)
                throw new Error(`Error occurred: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            data.forEach((d) => {
                d.start_date = new Date(d.start_date);
                d.end_date = new Date(d.end_date);
            });
            setData(data);
        })
        .catch((_) => {
            nav('/500');
        })
        .finally(() => setLoading(false));
}

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

    return (
        <>
            { data && (
                data.length ? (
                    data.map(item => (
                        <Trip
                            removeTrip={removeTrip}
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
