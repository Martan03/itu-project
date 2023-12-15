import { React, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import moment from 'moment';

import Layout from "../Layout";
import TripList from "../components/TripList";
import { DateRange } from "../components/DateRange";
import { TitleInput, DescInput } from "../components/Input";

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
    };

    const newTrip = () => {
        console.log("new trip");
        // TODO
    };

    const chooseImage = () => {
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => {
            let file = e.target.files[0];

            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = e => {
                setData({...data, ["image"]: e.target.result});
                // TODO: saveVacation(data2);
            }
        }

        input.click();
    };

    return (
        <Layout search={props.search} menu={props.menu}>
            { loading && <h2>Loading...</h2> }
            { data && (
                <>
                    <div className="vacation-header">
                        <img
                            className="img-hover"
                            onClick={chooseImage}
                            src={data.image}
                            alt={data.title + " picture"}/>
                        <div className="vacation-header-content">
                            <DateRange input
                                values={[data.start_date, data.end_date]}
                                onChange={inputChange}
                                onBlur={saveData}/>
                            <TitleInput
                                onChange={inputChange}
                                onBlur={saveData}
                                value={data.title}/>
                            <DescInput
                                onChange={inputChange}
                                onBlur={saveData}
                                value={data.description}/>
                        </div>
                    </div>
                </>
            )}
            <TripList id={id} />

            <div className="vacation">
                <div className="marker">
                    <div className="marker-circle"></div>
                    <div className="marker-line"></div>
                </div>
                <div className="data trip">
                    <button
                        className="dark-button add-trip-button"
                        onClick={newTrip}>
                        <h1>Add Trip</h1>
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default Vacation;
