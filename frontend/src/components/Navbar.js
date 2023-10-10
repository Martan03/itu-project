import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import '../css/Navbar.css';

function SearchBar() {
    const [query, setQuery] = useState('');
    const nav = useNavigate();

    async function handleSearch(event) {
        event.preventDefault();
        nav(`/vacations?query=${query}`)
    }

    return (
        <div className='search-bar'>
            <input
                className='form-input'
                type='search'
                placeholder='Search...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>
                <SearchIcon className="search-icon" />
            </button>
        </div>
    )
}

function Navbar() {
    return (
        <div className='navbar'>
            <SearchBar />
        </div>
    )
}

export default Navbar;
