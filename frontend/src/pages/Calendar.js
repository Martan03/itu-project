/**
 * ITU project
 *
 * Tomáš Daniel <xdanie14>
 */

import React, { useEffect, useState, Fragment } from "react";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import {
    Calendar as CalendarComponent,
    momentLocalizer,
    DateLocalizer
} from 'react-big-calendar'
import PropTypes from 'prop-types'
import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/Calendar.css';

import CalendarEdit from "../components/CalendarEdit.js";

function Calendar(props) {
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDates, setSelectedDates] = useState(null);

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
    }, [nav]);

    moment.updateLocale('en', {
        week: {
            dow: 1
        }
    })
    const localizer = momentLocalizer(moment);

    const doubleClickEvent = (e) => {
        nav(`/vacation?id=${e.id}`);
      };

      const handleSelectSlot = ({ start, end }) => {
        setSelectedDates({ start, end });
      };

      const handleSingleClick = ({ date }) => {
        setSelectedDates({ start: date, end: date });
      };

    return (
        <Fragment>
            <Layout search={props.search} menu={props.menu}>
                { loading && <h2>Loading...</h2> }
                { events &&
                    <div className="calendar-wrap">
                        <CalendarComponent
                            dayLayoutAlgorithm={'no-overlap'}
                            className="calendar"
                            localizer={localizer}
                            events={events}
                            onSelectEvent={handleSingleClick}
                            onSelectSlot={handleSelectSlot}
                            onDoubleClickEvent={doubleClickEvent}
                            selectable
                        />

                        {selectedDates && (
                            <div className="calendar-edit-form">
                            <CalendarEdit
                                startD={selectedDates.start}
                                endD={selectedDates.end}
                                onClose={() => setSelectedDates(null)}
                            />
                            </div>
                        )}
                </div>
                }
            </Layout>
        </Fragment>
    );
}

Calendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}

export default Calendar;
