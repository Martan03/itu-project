/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import React from "react";
import Layout from "../../Layout";

function NotFound(props) {
    return (
        <Layout search={props.search} menu={props.menu}>
            <h1 className="err-header">Internal server error!</h1>
            <p className="err-content">
                We are sorry, but there was an unexpected server error.
                Please try again in a moment.
            </p>
        </Layout>
    );
}

export default NotFound;