import { React, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

import Layout from "../Layout";
import TripList from "../components/TripList";
import DateRange from "../components/DateRange";

function saveVacation(vacation) {
    vacation.start_date = moment(vacation.start_date).format("YYYY-MM-DD");
    vacation.end_date = moment(vacation.end_date).format("YYYY-MM-DD");
    const save = async () => {
        try {
            const res = await fetch('http://localhost:3002/api/vacation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vacation),
            });

            if (!res.ok) {
                throw new Error(res.status);
            }
        } catch (err) {
            console.error(err);
        }
    }
    save();
}

function Vacation(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedData, setSavedData] = useState(null);
    const [anyChange, setAnyChange] = useState(false);

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
                let pdata = {
                    ...data[0],
                    ["start_date"]: new Date(data[0].start_date),
                    ["end_date"]: new Date(data[0].end_date),
                }
                setData(pdata);
                setSavedData(pdata);
            })
            .catch((_) => {
                nav(`/500`);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, nav]);

    const confirmTitle = (e) => {
        if (e.key === "Enter") {
            e.target.blur()
        }
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        setAnyChange(String(value) !== String(savedData[name]));
    };

    const saveData = () => {
        if (anyChange) {
            saveVacation(data);
            setSavedData(data);
            setAnyChange(false);
        }
    }

    return (
        <Layout search={props.search} menu={props.menu}>
            { loading && <h2>Loading...</h2> }
            { data && (
                <>
                    <div className="vacation-header">
                        <img src={data.image}
                            alt={data.title + " picture"} />
                        <div className="vacation-header-content">
                            <DateRange input
                                names={["start_date", "end_date"]}
                                values={[data.start_date, data.end_date]}
                                onChange={inputChange}
                                onBlur={saveData}/>
                            <input
                                className="vacation-title-input"
                                value={data.title}
                                type="text"
                                onChange={inputChange}
                                onKeyDown={confirmTitle}
                                name="title"
                                placeholder="Title"
                                onBlur={saveData}/>
                            <textarea
                                value={data.description}
                                name="description"
                                onChange={inputChange}
                                placeholder="Description"
                                onBlur={saveData}/>
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
