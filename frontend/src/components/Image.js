/// Renders image from the server
function Image(props) {
    const url = 'http://localhost:3002/uploads/';
    console.log(props.src);
    return (
        <img
            className={props.className ?? ''}
            src={url + props.src}
            alt={props.alt ?? ''}
        />
    )
}

export default Image;
