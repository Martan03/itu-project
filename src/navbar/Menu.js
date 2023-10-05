import React from 'react';

function MenuButton(props) {
    let className = 'menu-button';
    if (props.active) {
        className += ' active';
    }

    return (
        <a href={props.url} className={className}>
            <div className={ props.active && 'active' }></div>
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
                    active={true}
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
