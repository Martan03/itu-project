import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

function SearchBar() {
    const [query, setQuery] = useState('');
    const nav = useNavigate();

    async function handleSearch(event) {
        event.preventDefault();
        nav(`/vacations?query=${query}`)
    }

    return (
        <>
            <input
                className='form-input'
                type='search'
                placeholder='Search...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>
                <img src="/icons/search.svg" alt='search button' />
            </button>
        </>
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
