import React from "react";

import Sidebar from "./navbar/Menu";
import Navbar from "./navbar/Navbar";

function Layout({content}) {
    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className="content">
                {content}
            </div>
        </div>
    )
}

export default Layout;
