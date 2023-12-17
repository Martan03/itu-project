/**
 * ITU project
 *
 * Jakub Antonín Štigler <xstigl00>
 */

import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Layout from "../Layout";
import TripList from "../components/TripList";
import { DateRange } from "../components/DateRange";
import { TitleInput, DescInput } from "../components/Input";
import {
    saveVacation,
    getVacationWithTripsAndStops,
    saveTrip,
    uploadImage,
} from "../Db";
import Map from "../components/Map";
import { Checkbox } from "../components/Checkbox";

/// converts meters to kilometers with only one decimal place
function toKm(m) {
    return Math.trunc(m / 100) / 10;
}

/// clickable image, loads new image on click
function ImagePicker({data, setData, setSavedData}) {
    const chooseImage = () => {
        // The simplest way to open the file dialog is to simulate click on
        // file input
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => {
            const form = new FormData();
            form.append('image', e.target.files[0]);
            uploadImage(form).then(img => {
                console.log(img);
                const new_data = {
                    ...data,
                    image: img
                };
                // image is immidietly saved, so set both data and savedData
                setData(new_data);
                setSavedData(new_data);
                saveVacation(new_data);
            });
        }

        input.click();
    };

    return <img
        className="img-hover"
        onClick={chooseImage}
        src={'http://localhost:3002/uploads/' + data.image}
        alt={data.title + " picture"}/>;
}

/// Shows the vacation date, tithel and description
function VacationHeader(props) {
    // universal function for updating `data`
    const inputChange = (e) => {
        const { name, value } = e.target;
        // convert to string so that this also works for dates. If not for the
        // conversion, dates would by compared only with their references.
        props.setAnyChange(String(value) !== String(props.savedData[name]));
        props.setData({ ...props.data, [name]: value });
    };

    // saves the data to the database
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
        // create new trip for this vacation in database and open the trip page
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

/// Gets the type of the route not including subvariants
function getTravelType(trip) {
    if (!trip.route_type) {
        return 'other';
    }
    return trip.route_type.split("_")[0];
}

function TripsMap({trips}) {
    // filter for the displayed routes in map
    const [filter, setFilter] = useState({
        no_date: false,
        car: true,
        foot: true,
        bike: true,
        other: true,
    });

    // generic method for updating the filter
    const inputChange = e => {
        const { name, value } = e.target;
        setFilter({...filter, [name]: value});
    }

    let routes = trips
        .filter(t => t.stops.length >= 2 // don't try to show routes with less
                                         // than 2 points
            && (filter.no_date || t.start_date) // filter out trips without
                                                // date if it is set in filter
            && filter[getTravelType(t)] // filter by the type of the route
        )
        .map(t => ({
            // convert the trips to their routes that can be displayed by map
            showRoute: true,
            travelType: t.route_type || 'car_fast',
            coords: t.stops.map(s => [s.lng, s.lat]),
        }));

    return <div>
        <div className="vacation-map-filters">
            <Checkbox
                name={"no_date"}
                label={"With no date"}
                onChange={inputChange}
                value={filter.no_date}/>
            <Checkbox
                name={"car"}
                label={"In car"}
                onChange={inputChange}
                value={filter.car}/>
            <Checkbox
                name={"foot"}
                label={"On foot"}
                onChange={inputChange}
                value={filter.foot}/>
            <Checkbox
                name={"bike"}
                label={"On bike"}
                onChange={inputChange}
                value={filter.bike}/>
            <Checkbox
                name={"other"}
                label={"Other"}
                onChange={inputChange}
                value={filter.other}/>
        </div>
        <div className="vacation-map">
            <Map
                key={routes.length}
                lang={'cs'}
                size={{height: '100%', width: '100%'}}
                routes={routes}/>
        </div>
    </div>
}

/// gets stats from the trips for the given route type
function getStats(trips, type) {
    // filter only the trips with the correct type, when type is null take all
    // trips
    let filtered = type ? trips.filter(t => getTravelType(t) === type) : trips;
    // skip the stats if they souldn't be displayed for that category.
    // Stats are not displayed for the category if there are no trips with that
    // category, or if all trips have this category.
    if (type && (filtered.length === 0 || filtered.length === trips.length)) {
        return null;
    }

    // get the distances
    filtered = filtered.map(t => t.route_len ?? 0);

    // sum all the distances
    let dist = filtered.reduce((sum, d) => sum + d, 0);
    return {
        count: filtered.length,
        dist: dist,
        avg_dist: dist / filtered.length,
        // find the max distance
        max_dist: filtered.reduce((max, c) => c > max ? c : max, 0),
    };
}

function VacationStats({trips}) {
    // get all stats for the all the categories
    let all = getStats(trips, null);
    let car = getStats(trips, 'car');
    let foot = getStats(trips, 'foot');
    let bike = getStats(trips, 'bike');
    let other = getStats(trips, 'other');

    // display stats of category only if they should be displayed
    return <div className="vacation-stats">
        <p>Number of trips: {all.count}</p>
        <p>Total distance: {toKm(all.dist)} km</p>
        <p>Avg distance: {toKm(all.avg_dist)} km</p>
        <p>Max distance: {toKm(all.max_dist)} km</p>
        { car ? <>
            <p>Number of car trips: {car.count}</p>
            <p>Car distance: {toKm(car.dist)} km</p>
            <p>Avg car distance: {toKm(car.avg_dist)} km</p>
            <p>Longest car ride: {toKm(car.max_dist)} km</p>
        </> : <></> }
        { foot ? <>
            <p>Number of trips by foot: {foot.count}</p>
            <p>Distance walked: {toKm(foot.dist)} km</p>
            <p>Avg walk distance: {toKm(foot.avg_dist)} km</p>
            <p>Longest walk: {toKm(foot.max_dist)} km</p>
        </> : <></> }
        { bike ? <>
            <p>Number of trips on bike: {bike.count}</p>
            <p>Distance biked: {toKm(bike.dist)} km</p>
            <p>Avg bike distance: {toKm(bike.avg_dist)} km</p>
            <p>Longest bike ride: {toKm(bike.max_dist)} km</p>
        </> : <></> }
        { other ? <>
            <p>Number other trips: {other.count}</p>
            <p>Distance of other trips: {toKm(other.dist)} km</p>
            <p>Avg distance of other trips: {toKm(other.avg_dist)} km</p>
            <p>Longest other trip: {toKm(other.max_dist)} km</p>
        </> : <></> }
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

    // sort the trips every time they change
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

    // make sure that start_date and end_date have the correct data type
    const mapVacation = v => {
        v.start_date = new Date(v.start_date);
        v.end_date = new Date(v.end_date);
        setData({...v});
        setSavedData(v);
    };

    // load the vacation, trips and stops for all trips from the database
    useEffect(() => getVacationWithTripsAndStops(
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
                        <ImagePicker
                            data={data}
                            setData={setData}
                            setSavedData={setSavedData} />
                        <VacationHeader
                            data={data}
                            setData={setData}
                            anyChange={anyChange}
                            setAnyChange={setAnyChange}
                            savedData={savedData}
                            setSavedData={setSavedData} />
                    </div>

                    <TripList id={id} trips={trips} setTrips={updateTrips} />
                    <AddTripButton id={id} />
                    <VacationStats trips={trips}/>
                    <TripsMap trips={trips} />
                </>
            )}
        </Layout>
    );
}

export default Vacation;
