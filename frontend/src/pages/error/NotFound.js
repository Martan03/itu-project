import React from "react";
import Layout from "../../Layout";

function NotFound(props) {
    return (
        <Layout search={props.search} menu={props.menu}>
            <h1 className="err-header">Page not found!</h1>
            <p className="err-content">
                We are sorry, the requested page does not exist on our website.
            </p>
        </Layout>
    );
}

export default NotFound;