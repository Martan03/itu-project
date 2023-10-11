import React from "react";
import Layout from "../Layout";
import VacationList from "../components/VacationList";

function PastVacations(props) {
    return (
        <Layout search={props.search}>
            <VacationList api="/vacation/past" />
        </Layout>
    );
}

export default PastVacations;
