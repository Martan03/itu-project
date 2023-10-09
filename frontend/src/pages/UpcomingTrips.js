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
            <div className="vacation">
                <div className="marker">
                    <div className="marker-circle"></div>
                    <div className="marker-line"></div>
                </div>
                <div className="data">
                    <p className="date">5.10. - 10.10. 2023</p>
                    <div className="card">
                        <img src="/pics/paris.jpg" />
                        <div className="card-content">
                            <h2>Paris vacation</h2>
                            <p>There could be a short description of the trip</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UpcomingTrips;
