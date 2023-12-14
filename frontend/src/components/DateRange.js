/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import moment from 'moment';

/// Renders date range of given dates
function DateRange(props) {
    const from = moment(props.start_date).format('DD.MM.');
    const to = moment(props.end_date).format('DD.MM. YYYY');

    return <p className="date">{from} - {to}</p>
}

export default DateRange;
