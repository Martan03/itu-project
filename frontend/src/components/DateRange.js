/**
 * ITU project
 *
 * Jakub Antonín Štigler <xstigl00>
 */

import moment from 'moment';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css'

function DateInput(props) {
    const onChange = (e) => {
        if (props.data) {
            props.data.setData({
                ...props.data.data,
                [props.name]: e,
            });
        }

        if (props.onChange) {
            props.onChange({ target: { value: e, name: props.name } });
        }
    };

    const onBlur = (e) => {
        if (props.save) {
            props.save(props.data.data);
        }

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
        value={props.data ? props.data.data[props.name] : props.value}
    />
}

/// Renders date range of given dates
function DateRange(props) {
    if (!props.input) {
        const from = moment(props.start_date).format('DD.MM.');
        const to = moment(props.end_date).format('DD.MM. YYYY');
        return props.start_date === props.end_date
            ? <p className="date">{to}</p>
            : <p className="date">{from} - {to}</p>;
    }

    return <div className="date-range">
        <DateInput
            value={props.values ? props.values[0] : null}
            name={props.names ? props.names[0] : "start_date"}
            onChange={props.onChange}
            onBlur={props.onBlur}
            data={props.data}
            save={props.save}/>
        -
        <DateInput
            value={props.values ? props.values[1] : null}
            name={props.names ? props.names[1] : "end_date"}
            onChange={props.onChange}
            onBlur={props.onBlur}
            data={props.data}
            save={props.save}/>
    </div>
}

function DateRangeInput(props) {
    return DateRange({...props, input: true});
}

export {DateRange, DateRangeInput, DateInput};
