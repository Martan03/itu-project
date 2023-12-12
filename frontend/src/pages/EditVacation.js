import { React, useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import moment from 'moment';
import Layout from "../Layout";
import TripList from "../components/TripList";

/// Renders vacation date
function VacationDate(props) {
    const from = moment(props.start_date).format('DD.MM.');
    const to = moment(props.end_date).format('DD.MM. YYYY');

    return <p className="date">{from} - {to}</p>
}

function EditVacation(props) {
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
        <Layout search={props.search} menu={props.menu}>
            { loading && <h2>Loading...</h2> }
            { error && <h2>Failed to load vacation</h2> }
            { data && (
                <>
                    <div className="vacation-header">
                        <img src={data.image}
                            alt={data.title + " picture"} />
                        <div className="vacation-header-content">
                            <VacationDate
                                start_date={data.start_date}
                                end_date={data.end_date}
                            />
                            <input value={data.title}/>
                            <textarea contentEditable="true">{data.description}</textarea>
                        </div>
                    </div>
                    <Link to={`/vacation?id=${id}`}>
                        <button className="bottom-right-float">Save</button>
                    </Link>
                </>
            )}
            <TripList api={`/trip?vacation_id=${id}`} />

            <div className="vacation">
                <div className="marker">
                    <div className="marker-circle"></div>
                    <div className="marker-line"></div>
                </div>
                <div className="data trip">
                    <p className="date">Select Date</p>
                    <div className="card trip">
                        <div className="card-content">
                            <div className="card-expand">
                                <input placeholder="Title"/>
                            </div>
                            <div className="card-desc-edit">
                                <textarea placeholder="Description"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default EditVacation;
