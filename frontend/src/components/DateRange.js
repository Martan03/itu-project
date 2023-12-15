import moment from 'moment';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';

/// Renders date range of given dates
function DateRange(props) {
    if (!props.editable) {
        const from = moment(props.start_date).format('DD.MM.');
        const to = moment(props.end_date).format('DD.MM. YYYY');
        return props.start_date == props.end_date
            ? <p className="date">{to}</p>
            : <p className="date">{from} - {to}</p>;
    }

    const onStartChange = (e) => {
        if (props.onStartChange) {
            props.onStartChange(e);
        }
    };

    const onEndChange = (e) => {
        if (props.onEndChange) {
            props.onEndChange(e);
        }
    };

    const onStartBlur = (e) => {
        if (props.onStartBlur) {
            if (!e.target.parentElement.parentElement.matches(":focus-within"))
            {
                props.onStartBlur();
            }
        }
    };

    const onEndBlur = (e) => {
        if (props.onStartBlur) {
            if (!e.target.parentElement.parentElement.matches(":focus-within"))
            {
                props.onEndBlur();
            }
        }
    };

    return <div className="date-range">
        <DatePicker
            calendarIcon={null}
            clearIcon={null}
            disableCalendar
            className="date-picker"
            format="dd.MM.yyyy"
            onChange={onStartChange}
            onBlur={onStartBlur}
            value={props.start_date}
        />
        -
        <DatePicker
            calendarIcon={null}
            clearIcon={null}
            disableCalendar
            className="date-picker"
            format="dd.MM.yyyy"
            onChange={onEndChange}
            onBlur={onEndBlur}
            value={props.end_date}
        />
    </div>
}

export default DateRange;
