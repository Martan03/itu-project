import { React, useState, useEffect } from "react";
import Layout from "../Layout";

// TODO: Upcoming trips page

function UpcomingTrips() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3002/api/trip')
            .then((response) => {
                if (!response.ok)
                    throw new Error(`Error occurred: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setData(data);
                setError(null);
            })
            .catch((err) => {
                setData(null);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Layout>
            <h1>Not implemented yet</h1>
        </Layout>
    );
}

export default UpcomingTrips;
