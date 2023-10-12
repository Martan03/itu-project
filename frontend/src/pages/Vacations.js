import React from "react";
import { useLocation } from 'react-router-dom';
import Layout from "../Layout";
import VacationList from "../components/VacationList";

function Vacations(props) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const search = params.get('query');

    return (
        <Layout search={props.search}>
            <VacationList api={`/vacation?query=${search ?? ''}`} />
        </Layout>
    );
}

export default Vacations;