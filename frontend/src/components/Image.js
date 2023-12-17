/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

/// Renders image from the server
function Image(props) {
    const url = 'http://localhost:3002/uploads/';
    return (
        <img
            className={props.className ?? ''}
            src={url + (props.src ?? 'placeholder.png')}
            alt={props.alt ?? ''}
        />
    )
}

export default Image;
