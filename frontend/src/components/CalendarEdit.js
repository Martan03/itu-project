/**
 * ITU project
 *
 * Tomáš Daniel <xdanie14>
 */

import { React, useState } from "react";
import { saveVacation } from "../Db";
import { TitleInput, DescInput } from "../components/Input";
import { DateRange } from "../components/DateRange";

function EditVacPart(props, start_date, end_date) {
    const inputChange = (e) => {
        const { name, value } = e.target;

        props.setAnyChange(String(value) !== String(props.savedData[name]));
        props.setData({ ...props.data, [name]: value });
    };

    const saveData = () => {
        if (props.anyChange) {
            saveVacation(props.data);
            props.setSavedData(props.data);
            props.setAnyChange(false);
        }
    };

    return <div className="vacation-header-content">
        <DateRange input
            values={[start_date, end_date]}
            onChange={inputChange}
            onBlur={saveData}/>
        <TitleInput
            onChange={inputChange}
            onBlur={saveData}
            value={props.data.title}/>
        <DescInput
            onChange={inputChange}
            onBlur={saveData}
            value={props.data.description}/>
    </div>;
}

function CalendarEdit( {startD, endD} ) {
    const [data, setData] = useState(null);
    const [savedData, setSavedData] = useState(null);
    const [anyChange, setAnyChange] = useState(false);

    return (
        <div className="vacation-header">
            <EditVacPart
                start_date={startD}
                end_date={endD}
                data={data}
                setData={setData}
                anyChange={anyChange}
                setAnyChange={setAnyChange}
                savedData={savedData}
                setSavedData={setSavedData} />
        </div>
    );
}

export default CalendarEdit;
