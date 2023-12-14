/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import React from "react";
import { useLocation } from 'react-router-dom';

import Layout from "../Layout";
import VacationList from "../components/VacationList";

/// Renders vacations
function Vacations(props) {
    // Gets search query
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const search = params.get('query');

    return (
        <Layout search={props.search} menu={props.menu}>
            <VacationList
                time={search ? 0 : props.time}
                search={search}
            />
        </Layout>
    );
}

export default Vacations;
