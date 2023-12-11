import { React, useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
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
    const [editTitle, setEditTitle] = useState(false);
    const [editDesc, setEditDesc] = useState(false);

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

    const startEditTitle = () => setEditTitle(true);
    const stopEditTitle = () => setEditTitle(false);
    const confirmTitle = (e) => {
        if (e.key == "Enter") {
            stopEditTitle()
        }
    }
    const inputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const startEditDesc = () => setEditDesc(true);
    const stopEditDesc = () => setEditDesc(false);

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
                            { editTitle && (
                                <input value={data.title}
                                    type="text"
                                    onKeyDown={confirmTitle}
                                    onChange={inputChange}
                                    name="title"
                                    autoFocus
                                    placeholder="Title"
                                    onBlur={stopEditTitle}/>
                            ) || (
                                <h1 onClick={startEditTitle}>
                                    { data.title === ""
                                        && "Title"
                                        || data.title
                                    }
                                </h1>
                            ) }
                            { editDesc && (
                                <textarea contentEditable="true"
                                    autoFocus
                                    name="description"
                                    onChange={inputChange}
                                    placeholder="Description"
                                    onBlur={stopEditDesc}>
                                    {data.description}
                                </textarea>
                            ) || (
                                <p onClick={startEditDesc}
                                    className="vacation-description">
                                    { data.description === ""
                                        && "Description"
                                        || data.description
                                    }
                                </p>
                            ) }
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
