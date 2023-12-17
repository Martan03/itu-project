/**
 * ITU project
 *
 * Jakub Antonín Štigler <xstigl00>
 */

function Checkbox(props) {
    let onChange = () => {
        if (props.onChange) {
            // add relevant information to the event
            props.onChange({
                target: {
                    name: props.name,
                    value: !props.value,
                }
            });
        }
    };

    // it is just checkbox with label, the label can also be clicked
    return <div className="checkbox">
        <input
            type="checkbox"
            name={props.name}
            checked={props.value}
            onChange={onChange}/>
        <label onClick={onChange} className="unselectable">
            {props.label}
        </label>
    </div>
}

export { Checkbox };
