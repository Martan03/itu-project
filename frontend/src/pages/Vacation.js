import { React, useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import Layout from "../Layout";
import TripList from "../components/TripList";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';

function saveVacation(vacation) {
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

/// Renders vacation date
function VacationDate(props) {
    const [startDate, setStartDate] = useState(props.start_date);
    const [endDate, setEndDate] = useState(props.end_date);

    const changeStartDate = (e) => {
        setStartDate(e);
    }

    const changeEndDate = (e) => {
        setEndDate(e);
    }

    const saveStartDate = () => {
        props.saveStartDate(startDate);
    }

    const saveEndDate = () => {
        props.saveEndDate(startDate);
    }

    return <div className="date-range">
        <DatePicker
            calendarIcon={null}
            clearIcon={null}
            disableCalendar
            className="date-picker"
            format="dd.MM.yyyy"
            onChange={changeStartDate}
            onBlur={saveStartDate}
            value={startDate}
        />
        -
        <DatePicker
            calendarIcon={null}
            clearIcon={null}
            disableCalendar
            className="date-picker"
            format="dd.MM.yyyy"
            onChange={changeEndDate}
            onBlur={saveEndDate}
            value={endDate}
        />
    </div>

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
                setData({
                    ...data[0],
                    ["start_date"]:
                        moment(data[0].start_date).format("YYYY-MM-DD"),
                    ["end_date"]:
                        moment(data[0].end_date).format("YYYY-MM-DD"),
                });
                setError(null);
            })
            .catch((err) => {
                setData(null);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const confirmTitle = (e) => {
        if (e.key === "Enter") {
            e.target.blur()
        }
    }

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const stopEditDesc = () => {
        console.log("save desc");
        saveVacation(data);
    };
    const stopEditTitle = () => {
        console.log("save title");
        saveVacation(data);
    };
    const saveStartDate = (d) => {
        console.log("save start");
        setData({ ...data, ["start_date"]: moment(d).format("YYYY-MM-DD") });
        saveVacation(data);
    };
    const saveEndDate = (d) => {
        console.log("save end");
        setData({ ...data, ["end_date"]: moment(d).format("YYYY-MM-DD") });
        saveVacation(data);
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
                                saveStartDate={saveStartDate}
                                saveEndDate={saveEndDate}/>
                            <input
                                className="vacation-title-input"
                                value={data.title}
                                type="text"
                                onChange={inputChange}
                                onKeyDown={confirmTitle}
                                name="title"
                                placeholder="Title"
                                onBlur={stopEditTitle}/>
                            <textarea
                                contentEditable="true"
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
