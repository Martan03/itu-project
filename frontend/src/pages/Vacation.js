import React from "react";
import Layout from "../Layout";
import { useLocation } from 'react-router-dom';
import TripList from "../components/TripList";

function Vacation(props) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    return (
        <Layout search={props.search}>
            <TripList api={`/trip?vacation_id=${id}`} />
            
        </Layout>
    );
}

export default Vacation;
