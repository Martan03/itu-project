import React, { useState, useEffect } from "react";

import Sidebar from "./components/Menu";
import Navbar from "./components/Navbar";

function Layout(props) {
    useEffect(() => {
        if (props.menu.small) {
            props.menu.setMenuVis(false);
        }
    }, []);

    window.addEventListener('resize', () => {
        const s = window.innerWidth < 1000;
        if (props.menu.small !== s) {
            props.menu.setSmall(s);
            props.menu.setMenuVis(!s);
        }
    })

    return (
        <div className="layout">
            <Navbar search={props.search} menu={props.menu} />
            <Sidebar menu={props.menu.menuVis} />
            <div className={`content ${props.menu.menuVis ? '' : 'expanded'}`}>
                {props.children}
            </div>
        </div>
    )
}

export default Layout;
