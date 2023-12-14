import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import {
    Calendar as CalendarComponent,
    momentLocalizer
} from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/Calendar.css';

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
                        id: vacation.id,
                        start: new Date(vacation.start_date),
                        end: new Date(vacation.end_date),
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

    moment.updateLocale('en', {
        week: {
            dow: 1
        }
    })
    const localizer = momentLocalizer(moment);

    const selectEvent = (e) => {
       nav(`/vacation?id=${e.id}`);
    }

    return (
        <Layout search={props.search} menu={props.menu}>
            { loading && <h2>Loading...</h2> }
            { events &&
                <CalendarComponent
                    className="calendar"
                    localizer={localizer}
                    events={events}
                    onSelectEvent={selectEvent}
                />
            }
        </Layout>
    );
}

export default Calendar;
