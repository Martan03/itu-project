import React from "react";

import Sidebar from "./components/Menu";
import Navbar from "./components/Navbar";

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
