import { React, useState, useEffect } from "react";
import { ReactComponent as Expand } from '../icons/expand.svg';
import moment from 'moment';

/// Fetches data from API from given url
/// requires setData, setError, setLoading to set corresponding values
async function FetchApi(url, setData, setLoading, setError) {
    fetch(`http://localhost:3002/api${url}`)
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
}

/// Component to display trip stop
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

/// Renders given stops
/// If loading is not null, renders loading message
/// If error is not null, render error message
function RenderStops(stops, loading, error) {
    if (loading)
        return <h2>Loading...</h2>;
    if (error)
        return <h2>Failed to load trip stops</h2>;
    if (!stops || !stops.length)
        return <h2>No trip stops found...</h2>

    return stops.map(item => (
        <Stop key="item.id" item={item} />
    ));
}

/// Renders given trip and its stops
function Trip(props) {
    const [stops, setStops] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        FetchApi(
            `/stop?trip_id=${props.item.id}`,
            setStops,
            setLoading,
            setError
        );
    }, [props.item.id]);

    const toggleVisible = () => setVisible(!visible);

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
                <div className="card trip" onClick={toggleVisible}>
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
                { visible && RenderStops(stops, loading, error) }
            </div>
        </div>
    );
}

/// Renders vacation trips list
function TripList(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        FetchApi(props.api, setData, setLoading, setError);
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
