/**
 * ITU project
 *
 * Tomáš Daniel <xdanie14>
 */

import React, { useEffect, useState, Fragment, useCallback } from "react";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import {
    Calendar as CalendarComponent,
    momentLocalizer
} from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/Calendar.css';

//import CalendarEdit from "../components/CalendarEdit.js";
import BottomModal from "../components/BottomModal.js";

import { saveVacation } from "../Db";

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

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
          const st = moment(start).format('DD.MM. YYYY'); // start
          const en = moment(end).format('DD.MM. YYYY'); //end
          //saveVacation({});
          setSelectedDates({ st, en });
        },
        []
      )

      const handleSelectEvent = useCallback(
        (event) => window.alert(event.title),
        []
      )

    const doubleClickEvent = (e) => {
        nav(`/vacation?id=${e.id}`);
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
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
                            onDoubleClickEvent={doubleClickEvent}
                            selectable
                        />
                        {selectedDates && (
                            <BottomModal
                                start_date={selectedDates.st}
                                end_date={selectedDates.en}
                            />
                        )}
                </div>
                }
            </Layout>
        </Fragment>
    );
}

export default Calendar;