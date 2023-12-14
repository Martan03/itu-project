/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import moment from 'moment';
import DatePicker from "react-date-picker";

import 'react-date-picker/dist/DatePicker.css';

/// Renders date input
function DateInput(props) {
    // Sets changed value to data
    const onChange = (e) => {
        props.data.setData({
            ...props.data.data,
            [props.attr]: e,
        });
    }

    // Saves data on blur
    const onBlur = () => {
        props.save(props.data.data);
    }

    return (
        <DatePicker
            className="date-picker"
            clearIcon={null}
            disableCalendar
            format="dd.MM.yyyy"
            onChange={onChange}
            onBlur={onBlur}
            value={props.data.data[props.attr]}
        />
    )
}

/// Renders date range input
function DateRangeInput(props) {
    return (
        <div className='date-range'>
            <DateInput
                attr={"start_date"}
                data={props.data}
                save={props.save}
            />
            -
            <DateInput
                attr={"end_date"}
                data={props.data}
                save={props.save}
            />
        </div>
    )
}

/// Renders date range of given dates
function DateRange(props) {
    const from = moment(props.start_date).format('DD.MM.');
    const to = moment(props.end_date).format('DD.MM. YYYY');

    return <p className="date">{from} - {to}</p>
}

export {DateRange, DateRangeInput};
