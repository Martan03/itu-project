import React from "react";
import Layout from "../Layout";
import VacationList from "../components/VacationList";

function UpcomingVacations() {
    return (
        <Layout>
            <VacationList api="/vacation/upcoming" />
        </Layout>
    );
}

export default UpcomingVacations;
