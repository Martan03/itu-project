import React, { useState, useEffect } from "react";

import Sidebar from "./components/Menu";
import Navbar from "./components/Navbar";

function Layout(props) {
    const [small, setSmall] = useState(window.innerWidth < 1000);
    const [menuVis, setMenuVis] = useState(!small);

    return (
        <div className="layout">
            <Navbar search={props.search} menu={{menuVis, setMenuVis}} />
            <Sidebar menu={menuVis} />
            <div className={`content ${menuVis ? '' : 'expanded'}`}>
                {props.children}
            </div>
        </div>
    )
}

export default Layout;
