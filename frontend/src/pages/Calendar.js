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
    const [modalId, setModalId] = useState(null);

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
                    const start = new Date(vacation.start_date);
                    start.setHours(0, 0, 0, 0);

                    const end = new Date(vacation.end_date);
                    end.setHours(23, 59, 59, 0);

                    events.push({
                        id: vacation.id,
                        start,
                        end,
                        title: vacation.title ?? "No title",
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
          const start_date = new Date(start);
          start_date.setHours(0, 0, 0, 0);

          const end_date = new Date(end);
          end_date.setSeconds(end_date.getSeconds() - 1);
          end_date.setHours(23, 59, 59);

          saveVacation({start_date: start_date, end_date: end_date}).then(id => {
            setModalId(id);
            setEvents(prev => {
                return [
                    ...prev,
                    {
                        id: id,
                        start: start_date,
                        end: end_date,
                        title: 'No title'
                    },
                ]
            });
          });
        },
        []
      )

      const handleSelectEvent = useCallback(
        ({id}) => {
            setModalId(id);
        },
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
                        {modalId && (
                            <BottomModal
                                id={modalId}
                                setId={setModalId}
                                setEvents={setEvents}
                            />
                        )}
                </div>
                }
            </Layout>
        </Fragment>
    );
}

export default Calendar;