import moment from 'moment';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css'

function DateInput(props) {
    const onChange = (e) => {
        if (props.onChange) {
            props.onChange({ target: { value: e, name: props.name } });
        }
    };

    const onBlur = (e) => {
        if (props.onBlur) {
            if (!e.target.parentElement.parentElement.matches(":focus-within"))
            {
                props.onBlur({target: { name: props.name }});
            }
        }
    };

    return <DatePicker
        calendarIcon={null}
        clearIcon={null}
        disableCalendar
        className="date-picker"
        format={props.format ? props.format : "dd.MM.yyyy"}
        onChange={onChange}
        onBlur={onBlur}
        value={props.value}
    />
}

/// Renders date range of given dates
function DateRange(props) {
    if (!props.input) {
        const from = moment(props.start_date).format('DD.MM.');
        const to = moment(props.end_date).format('DD.MM. YYYY');
        return props.start_date == props.end_date
            ? <p className="date">{to}</p>
            : <p className="date">{from} - {to}</p>;
    }

    return <div className="date-range">
        <DateInput
            value={props.values[0]}
            name={props.names[0]}
            onChange={props.onChange}
            onBlur={props.onBlur}/>
        -
        <DateInput
            value={props.values[1]}
            name={props.names[1]}
            onChange={props.onChange}
            onBlur={props.onBlur}/>
    </div>
}

export default DateRange;
