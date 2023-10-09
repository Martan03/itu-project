import { React, useState, useEffect } from "react";
import Layout from "../Layout";
import Vacation from "../components/Vacation";

function UpcomingVacations() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3002/api/vacation/upcoming')
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
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                data.map(item => (
                    <Vacation item={item} />
                ))
            )}
        </Layout>
    );
}

export default UpcomingVacations;
