/**
 * ITU project
 *
 * Martin Slezák <xsleza26>
 */

import React from 'react';
import { Link, useLocation } from "react-router-dom";

import '../css/Navbar.css';

/// Renders menu button, highlights current page
function MenuButton(props) {
    const location = useLocation();
    const active = props.url === location.pathname;

    return (
        <Link className={`menu-button ${active ? 'active' : ''}`}
              to={props.url} >
            <div></div>
            {props.title}
        </Link>
    )
}

/// Renders side app menu containing links to other pages
/// If `menu` is false it hides the menu, else shows
function Menu(props) {
    return (
        <div className={`menu ${props.menu ? '' : 'hidden'}`}>
            <div>
                <MenuButton title="Upcoming vacations" url="/" />
                <MenuButton title="Past vacations" url="/past" />
                <MenuButton title="Calendar" url="/calendar" />
            </div>
            <div>
                <MenuButton title="Settings" url="/settings" />
            </div>
        </div>
    )
}

export default Menu;
