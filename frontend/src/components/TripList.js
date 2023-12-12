import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from 'moment';

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
            setData(data);
        })
        .catch((_) => {
            nav('/500');
        })
        .finally(() => setLoading(false));
}

/// Renders given trip and its stops
function Trip(props) {
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
                <Link to={`/trip?id=${props.item.id}`} className="card trip">
                    <div className="card-content">
                        <div className="card-expand">
                            <h2>{props.item.title}</h2>
                        </div>
                        <p>{props.item.description}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

/// Renders vacation trips list
function TripList(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const nav = useNavigate();

    useEffect(() => {
        FetchApi(props.api, setData, setLoading, nav);
    }, [props.api, nav]);

    return (
        <>
            { loading && <h1>Loading...</h1> }
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
