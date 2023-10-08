import React from "react";

import Sidebar from "./navbar/Menu";
import Navbar from "./navbar/Navbar";

function Layout({children}) {
    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default Layout;
