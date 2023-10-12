import { React, useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import Layout from "../Layout";
import TripList from "../components/TripList";

/// Renders vacation date
function VacationDate(props) {
    const from = moment(props.start_date).format('DD.MM.');
    const to = moment(props.end_date).format('DD.MM. YYYY');

    return <p className="date">{from} - {to}</p>
}

function Vacation(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    useEffect(() => {
        fetch(`http://localhost:3002/api/vacation?id=${id}`)
            .then((response) => {
                if (!response.ok)
                    throw new Error(`Error occurred: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setData(data[0]);
                setError(null);
            })
            .catch((err) => {
                setData(null);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <Layout search={props.search}>
            { loading && <h2>Loading...</h2> }
            { error && <h2>Failed to load vacation</h2> }
            { data && (
                <div className="vacation-header">
                    <img src={data.image}
                        alt={data.title + " picture"} />
                    <div className="vacation-header-content">
                        <VacationDate
                            start_date={data.start_date}
                            end_date={data.end_date}
                        />
                        <h1>{data.title}</h1>
                        <p>{data.description}</p>
                    </div>
                </div>
            )}
            <TripList api={`/trip?vacation_id=${id}`} />
        </Layout>
    );
}

export default Vacation;
