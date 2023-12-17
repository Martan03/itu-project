/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

/// Renders title input
function TitleInput(props) {
    // Confirm submit
    const confirm = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
        }
    }

    // Sets data value on change
    const onChange = (e) => {
        if (props.data) {
            const { name, value } = e.target;
            props.data.setData({
                ...props.data.data,
                [name]: value
            });
        }

        if (props.onChange) {
            props.onChange(e);
        }
    }

    // Saves data on blur
    const onBlur = () => {
        if (props.save) {
            props.save(props.data.data);
        }

        if (props.onBlur) {
            props.onBlur();
        }
    }

    return (
        <input
            className={`vacation-title-input ${props.small ? 'small' : ''}`}
            value={props.data ? props.data.data[props.name ?? 'title'] : props.value}
            type="text"
            onChange={onChange}
            onKeyDown={confirm}
            name={props.name ?? 'title'}
            placeholder={props.placeholder ?? 'Title'}
            onBlur={onBlur}
        />
    )
}

function DescInput(props) {
    // Sets data value on change
    const onChange = (e) => {
        if (props.data) {
            const { name, value } = e.target;
            props.data.setData({
                ...props.data.data,
                [name]: value
            });
        }

        if (props.onChange) {
            props.onChange(e);
        }
    }

    // Saves data on blur
    const onBlur = () => {
        if (props.save) {
            props.save(props.data.data);
        }

        if (props.onBlur) {
            props.onBlur();
        }
    }

    return (
        <textarea
            value={props.data ? props.data.data[props.name ?? 'description'] : props.value}
            name={props.name ?? 'description'}
            placeholder={props.placeholder ?? 'Description'}
            onChange={onChange}
            onBlur={onBlur}
            spellCheck="false"
        />
    )
}

export {TitleInput, DescInput};
