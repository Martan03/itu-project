import { React, useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Layout from "../Layout";
import VacationList from "../components/VacationList";

function Vacations() {
    const [query, setQuery] = useState('');
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const search = params.get('query');

    useEffect(() => {
        setQuery(search);
    }, [search])

    console.log(query);

    return (
        <Layout>
            <VacationList api={`/vacation?query=${query}`} />
        </Layout>
    );
}

export default Vacations;
