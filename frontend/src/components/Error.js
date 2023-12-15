/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

/// Displays internal server error message
function Error() {
    return (
        <>
            <h1 className="err-header">Internal server error!</h1>
            <p className="err-content">
                We are sorry, but there was an unexpected server error.
                Please try again in a moment.
            </p>
        </>
    );
}

export default Error;