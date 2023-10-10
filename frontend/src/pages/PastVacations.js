import React from "react";
import Layout from "../Layout";
import VacationList from "../components/VacationList";

function PastVacations() {
    return (
        <Layout>
            <VacationList api="/vacation/past" />
        </Layout>
    );
}

export default PastVacations;
