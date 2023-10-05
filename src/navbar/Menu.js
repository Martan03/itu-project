import React from 'react';

function MenuButton(props) {
    let className = 'menu-button';
    if (props.url === window.location.pathname) {
        className += ' active';
    }

    return (
        <a href={props.url} className={className}>
            <div></div>
            {props.title}
        </a>
    )
}

function Menu() {
    return (
        <div className='menu'>
            <div>
                <MenuButton
                    title="Upcoming trips"
                    url="/"
                />
                <MenuButton
                    title="Past trips"
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
