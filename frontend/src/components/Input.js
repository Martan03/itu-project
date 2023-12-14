/// Renders title input
function TitleInput(props) {
    // Confirm submit
    const confirm = (e) => {
        if (e.key === "Enter")
            e.target.blur();
    }

    // Sets data value on change
    const onChange = (e) => {
        const { name, value } = e.target;
        props.data.setData({
            ...props.data.data,
            [name]: value
        })
    }

    // Saves data on blur
    const onBlur = () => {
        props.save(props.data.data);
    }

    return (
        <input
            className={`vacation-title-input ${props.small ? 'small' : ''}`}
            value={props.data.data[props.attr ?? 'title']}
            type="text"
            onChange={onChange}
            onKeyDown={confirm}
            name={props.attr ?? 'title'}
            placeholder={props.placeholder ?? 'Title'}
            onBlur={onBlur}
        />
    )
}

function DescInput(props) {
    // Sets data value on change
    const onChange = (e) => {
        const { name, value } = e.target;
        props.data.setData({
            ...props.data.data,
            [name]: value
        })
    }

    // Saves data on blur
    const onBlur = () => {
        props.save(props.data.data);
    }

    return (
        <textarea
            value={props.data.data[props.attr ?? 'description']}
            name={props.attr ?? 'description'}
            placeholder={props.placeholder ?? 'Description'}
            onChange={onChange}
            onBlur={onBlur}
        />
    )
}

export {
    TitleInput,
    DescInput
};
