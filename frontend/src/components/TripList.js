import { React, useState, useEffect } from "react";
import { ReactComponent as Expand } from '../icons/expand.svg';
import moment from 'moment';

function Stop(props) {
    return (
        <div className="card stop">
            <img src={props.item.image}
                    alt={props.item.title + " picture"} />
            <div className="card-content">
                <h2>{props.item.title}</h2>
                <p>{props.item.description}</p>
            </div>
        </div>
    )
}

function Trip(props) {
    const [stops, setStops] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3002/api/stop?trip_id=${props.item.id}`)
            .then((response) => {
                if (!response.ok)
                    throw new Error(`Error occurred: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setStops(data);
                setError(null);
            })
            .catch((err) => {
                setStops(null);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [props.item.id]);

    async function onClick(event) {
        event.preventDefault();
        setVisible(!visible);
    }

    const from = moment(props.item.start_date).format('DD.MM.');
    const to = moment(props.item.end_date).format('DD.MM. YYYY');

    return (
        <div className="vacation">
            <div className="marker">
                <div className="marker-circle"></div>
                <div className="marker-line"></div>
            </div>
            <div className="data trip">
                <p className="date">{from} - {to}</p>
                <div className="card trip" onClick={onClick}>
                    <div className="card-content">
                        <div className="card-expand">
                            <h2>{props.item.title}</h2>
                            <Expand className={
                                `card-expand-icon ${
                                    visible ? 'visible' : ''
                                }`}
                            />
                        </div>
                        <p>{props.item.description}</p>
                    </div>
                </div>
                { visible ? (
                    loading && <h2>Loading...</h2>,
                    error && <h2>Failed to load trip stops</h2>,
                    stops && (
                        stops.length ? (
                            stops.map((item, index) => (
                                <Stop item={item} nth={index + 1} />
                            ))
                        ) : (
                            <h2>No trip stops found...</h2>
                        )
                    )
                ) : ''}
            </div>
        </div>
    );
}

function TripList(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3002/api' + props.api)
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
    }, [props.api]);

    return (
        <>
            { loading && <h1>Loading...</h1> }
            { error && <h1>Failed to load vacation trips</h1> }
            { data && (
                data.length ? (
                    data.map(item => (
                        <Trip item={item} key={item.id} />
                    ))
                ) : (
                    <h1>No vacation trips found...</h1>
                )
            )}
        </>
    );
}

export default TripList;
