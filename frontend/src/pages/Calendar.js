import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import {
    Calendar as CalendarComponent,
    momentLocalizer
} from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css';

function Calendar(props) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const nav = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3002/api/vacation')
            .then((response) => {
                if (!response.ok)
                    throw new Error(`Error occurred: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                var events = [];
                for (let vacation of data) {
                    events.push({
                        start: vacation.start_date,
                        end: vacation.end_date,
                        title: vacation.title,
                    });
                }
                setEvents(events);
            })
            .catch((_) => {
                nav('/500');
            })
            .finally(() => setLoading(false));
    }, []);

    const localizer = momentLocalizer(moment);

    return (
        <Layout search={props.search} menu={props.menu}>
            <CalendarComponent
                localizer={localizer}
                events={events}
                style={{height: 500}}
            />
        </Layout>
    );
}

export default Calendar;
