import { React, useState, useEffect } from "react";
import moment from 'moment';

function Vacation(props) {
    const from = moment(props.item.start_date).format('DD.MM.');
    const to = moment(props.item.end_date).format('DD.MM. YYYY');

    return (
        <div className="vacation">
            <div className="marker">
                <div className="marker-circle"></div>
                <div className="marker-line"></div>
            </div>
            <div className="data">
                <p className="date">{from} - {to}</p>
                <div className="card">
                    <img src={props.item.image}
                         alt={props.item.title + " picture"} />
                    <div className="card-content">
                        <h2>{props.item.title}</h2>
                        <p>{props.item.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VacationList(props) {
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
    }, []);

    return (
        <>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                error ? (
                    <h1>Error loading vacations</h1>
                ) : (
                    data.map(item => (
                        <Vacation key={item.id} item={item} />
                    ))
                )
            )}
        </>
    );
}

export default VacationList;
