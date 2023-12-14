import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import '../css/Navbar.css';

function Burger(props) {
    const onClick = () => {
        props.menu.setMenuVis(!props.menu.menuVis)
    };

    return (
        <div className='navbar-burger' onClick={onClick}>
            <div className='line1'></div>
            <div className='line2'></div>
            <div className='line3'></div>
        </div>
    )
}

function SearchBar(props) {
    const nav = useNavigate();

    async function handleSearch(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        props.search.setQuery(formData.get('query'));

        nav(`/vacations?query=${props.search.query}`)
    }

    return (
        <form className='search-bar' onSubmit={handleSearch}>
            <input
                className='form-input'
                type='text'
                name='query'
                placeholder='Search...'
                value={props.search.query}
                onChange={(e) => props.search.setQuery(e.target.value)}
            />
            <button type='submit'>
                <SearchIcon className="search-icon" />
            </button>
        </form>
    )
}

function Navbar(props) {
    return (
        <div className='navbar'>
            <Burger menu={props.menu} />
            <SearchBar search={props.search} />
            <div className='navbar-spacer'></div>
        </div>
    )
}

export default Navbar;
