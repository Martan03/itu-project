import React from 'react';
import { Link } from "react-router-dom";

import '../css/Navbar.css';

function MenuButton(props) {
    let className = 'menu-button';
    if (props.url === window.location.pathname) {
        className += ' active';
    }

    return (
        <Link to={props.url} className={className}>
            <div></div>
            {props.title}
        </Link>
    )
}

function Menu(props) {
    return (
        <div className={`menu ${props.menu ? '' : 'hidden'}`}>
            <div>
                <MenuButton
                    title="Upcoming vacations"
                    url="/"
                />
                <MenuButton
                    title="Past vacations"
                    url="/past"
                />
                <MenuButton
                    title="Calendar"
                    url="/calendar"
                />
            </div>
            <div>
                <MenuButton
                    title="Settings"
                    url="/settings"
                />
            </div>
        </div>
    )
}

export default Menu;
