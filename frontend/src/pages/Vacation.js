import { React, useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import Layout from "../Layout";
import TripList from "../components/TripList";

/// Renders vacation date
function VacationDate(props) {
    const [editDate, setEditDate] = useState(false);

    const from = moment(props.start_date).format('DD.MM.');
    const to = moment(props.end_date).format('DD.MM. YYYY');

    const startEditDate = () => setEditDate(true);

    return editDate ? (
            <p className="date">
                <input className="vacation-date"
                    type="date"
                    autoFocus>
                </input>
                 -
                <input className="vacation-date"
                    type="date"
                    autoFocus>
                </input>
            </p>
        ) : (
            <p className="date"
                onClick={startEditDate}>
                {from} - {to}
            </p>
        );

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

    const stopEditTitle = () => {
        // TODO: save
    };
    const confirmTitle = (e) => {
        if (e.key == "Enter") {
            e.target.blur()
        }
    }

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const stopEditDesc = () => {
        // TODO: save
    };

    return (
        <Layout search={props.search}>
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
                            <input
                                className="vacation-title-input"
                                value={data.title}
                                type="text"
                                onChange={inputChange}
                                onKeyDown={confirmTitle}
                                name="title"
                                placeholder="Title"
                                onBlur={stopEditTitle}/>
                            <textarea contentEditable="true"
                                name="description"
                                onChange={inputChange}
                                placeholder="Description"
                                onBlur={stopEditDesc}>
                                {data.description}
                            </textarea>
                        </div>
                    </div>
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
