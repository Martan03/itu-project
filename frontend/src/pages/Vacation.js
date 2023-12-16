import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Layout from "../Layout";
import TripList from "../components/TripList";
import { DateRange } from "../components/DateRange";
import { TitleInput, DescInput } from "../components/Input";
import {
    saveVacation,
    getVacationWithTrips,
    saveTrip,
    getStopsForTrips,
} from "../Db";
import Map from "../components/Map";

function ImagePicker({data, setData}) {
    const chooseImage = () => {
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => {
            let file = e.target.files[0];

            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = e => {
                setData({...data, image: e.target.result});
                // TODO: saveVacation(data2);
            }
        }

        input.click();
    };

    return <img
        className="img-hover"
        onClick={chooseImage}
        src={data.image}
        alt={data.title + " picture"}/>;
}

function VacationHeader(props) {
    const inputChange = (e) => {
        const { name, value } = e.target;
        props.setData({ ...props.data, [name]: value });
        props.setAnyChange(String(value) !== String(props.savedData[name]));
    };

    const saveData = () => {
        if (props.anyChange) {
            saveVacation(props.data);
            props.setSavedData(props.data);
            props.setAnyChange(false);
        }
    };

    return <div className="vacation-header-content">
        <DateRange input
            values={[props.data.start_date, props.data.end_date]}
            onChange={inputChange}
            onBlur={saveData}/>
        <TitleInput
            onChange={inputChange}
            onBlur={saveData}
            value={props.data.title}/>
        <DescInput
            onChange={inputChange}
            onBlur={saveData}
            value={props.data.description}/>
    </div>;
}

function AddTripButton({id}) {
    const nav = useNavigate();

    const newTrip = () => {
        saveTrip({vacation_id: id}).then(id => nav(`/trip?id=${id}`));
    };

    return <div className="vacation">
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
}

function TripsMap({trips}) {
    const [routes, setRoutes] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getStopsForTrips(
            ts => {
                console.log(ts);
                setRoutes(ts
                    .filter(t => t.length >= 2)
                    .map(t => ({
                        showRoute: true,
                        travelType: 'car_fast',
                        coords: t.map(c => [c.lng, c.lat])
                    }))
                )
            },
            setLoaded,
            e => console.error(e),
            trips.map(t => t.id)
        );
    }, [trips]);

    console.log(routes);

    return <div className="vacation-map">
        { loaded
            ? <Map
                lang={'cs'}
                size={{height: '100%', width: '100%'}}
                routes={routes}/>
            : <h2>Loading...</h2>
        }
    </div>
}

function Vacation(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedData, setSavedData] = useState(null);
    const [anyChange, setAnyChange] = useState(false);
    const [trips, setTrips] = useState([]);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    const updateTrips = t => {
        let arr = [...t];
        arr.sort((a, b) => {
            if (!b.start_date) {
                return -1;
            }
            if (!a.start_date) {
                return 1;
            }
            return a.start_date - b.start_date;
        });
        setTrips(arr);
    }

    const mapVacation = v => {
        v.start_date = new Date(v.start_date);
        v.end_date = new Date(v.end_date);
        setData(v);
    };

    useEffect(() => getVacationWithTrips(
        mapVacation,
        t => {
            updateTrips(t.map(t => {
                if (t.start_date) {
                    t.start_date = new Date(t.start_date);
                }
                if (t.end_date) {
                    t.end_date = new Date(t.end_date);
                }
                return t;
            }));
        },
        setLoading,
        e => console.error(e),
        id
    ), [id]);
    return (
        <Layout search={props.search} menu={props.menu}>
            { loading && <h2>Loading...</h2> }
            { data && (
                <>
                    <div className="vacation-header">
                        <ImagePicker data={data} setData={setData} />
                        <VacationHeader
                            data={data}
                            setData={setData}
                            anyChange={anyChange}
                            setAnyChange={setAnyChange}
                            saveData={savedData}
                            setSavedData={setSavedData}/>
                    </div>

                    <TripList id={id} trips={trips} setTrips={updateTrips} />
                    <AddTripButton id={id} />
                    <TripsMap trips={trips} />
                </>
            )}
        </Layout>
    );
}

export default Vacation;
