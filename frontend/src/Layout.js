import React from "react";

import Sidebar from "./components/Menu";
import Navbar from "./components/Navbar";

function Layout(props) {
    return (
        <div>
            <Navbar search={props.search} />
            <Sidebar />
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}

export default Layout;
