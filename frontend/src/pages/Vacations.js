/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Layout from "../Layout";
import VacationList from "../components/VacationList";
import { saveVacation } from "../Db";

/// Renders vacations
function Vacations(props) {
    // Gets search query
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const search = params.get('query');

    const nav = useNavigate();

    const addVacation = (e) => {
        e.preventDefault();
        saveVacation({}).then(id => nav(`/vacation?id=${id}`));
    }

    return (
        <Layout search={props.search} menu={props.menu} addClick={addVacation}>
            <VacationList
                time={search ? 0 : props.time}
                search={search}
            />
        </Layout>
    );
}

export default Vacations;
