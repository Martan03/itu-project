import React from "react";
import Layout from "../Layout";
import VacationList from "../components/VacationList";

function UpcomingVacations(props) {
    return (
        <Layout search={props.search}>
            <VacationList api="/vacation/upcoming" />
        </Layout>
    );
}

export default UpcomingVacations;
