/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { DateRange } from "../components/DateRange";
import Error from "./Error";
import { deleteVacation, getVacations } from "../Db";
import Image from "./Image";

import { ReactComponent as TrashIcon } from '../icons/trash.svg';

/// Renders vacation
function Vacation(props) {
    const delVacation = () => {
        deleteVacation(props.item.id)
        const arr = [...props.data.data];
        arr.splice(props.index, 1);
        props.data.setData(arr);
    }

    return (
        <div className="vacation">
            <div className="marker">
                <div className="marker-circle"></div>
                <div className="marker-line"></div>
            </div>
            <div className="data">
                <div className="trip-list-header">
                    <DateRange
                        start_date={props.item.start_date}
                        end_date={props.item.end_date}
                    />
                    <button
                        onClick={delVacation}
                        className="remove-trip-button">
                        <TrashIcon/>
                    </button>
                </div>
                <Link to={`/vacation?id=${props.item.id}`} className="card">
                    <Image src={props.item.image}
                         alt={props.item.title + " picture"} />
                    <div className="card-content">
                        <h2>{props.item.title}</h2>
                        <p>{props.item.description}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

/// Renders vacation list
function VacationList(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    // Loads vacations
    useEffect(() => {
        getVacations(setData, setLoading, setErr, props.time, props.search);
    }, [props.time, props.search]);

    return (
        <>
            { loading && <h2>Loading...</h2> }
            { err && <Error /> }
            { data && (
                data.map((item, index) => (
                    <Vacation
                        key={item.id}
                        index={index}
                        item={item}
                        data={{data, setData}}
                    />
                ))
            ) }
        </>
    );
}

export default VacationList;
