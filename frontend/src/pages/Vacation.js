import { React, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Layout from "../Layout";
import TripList from "../components/TripList";
import DateRange from "../components/DateRange";

/// Renders vacation details
function VacationDetails(props) {
    return (
        <div className="vacation-header">
            <img src={props.vacation.image}
                alt={props.vacation.title + " picture"} />
            <div className="vacation-header-content">
                <DateRange
                    start_date={props.vacation.start_date}
                    end_date={props.vacation.end_date}
                />
                <h1>{props.vacation.title}</h1>
                <p>{props.vacation.description}</p>
            </div>
        </div>
    )
}

function Vacation(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    const nav = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3002/api/vacation?id=${id}`)
            .then((response) => {
                if (!response.ok)
                    throw new Error(`Error occurred: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setData(data[0]);
            })
            .catch((_) => {
                nav(`/500`);
            })
            .finally(() => setLoading(false));
    }, [id, nav]);

    return (
        <Layout search={props.search} menu={props.menu}>
            { loading && <h2>Loading...</h2> }
            { data && (
                <>
                    <VacationDetails vacation={data} />
                    <Link to={`/edit-vacation?id=${id}`}>
                        <button className="bottom-right-float">Edit</button>
                    </Link>
                </>
            )}
            <TripList api={`/trip?vacation_id=${id}`} />
        </Layout>
    );
}

export default Vacation;
