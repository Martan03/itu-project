import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import '../css/Navbar.css';

function SearchBar() {
    const [query, setQuery] = useState('');
    const nav = useNavigate();

    async function handleSearch(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        setQuery(formData.get('query'));

        nav(`/vacations?query=${query}`)
    }

    return (
        <form className='search-bar' onSubmit={handleSearch}>
            <input
                className='form-input'
                type='search'
                name='query'
                placeholder='Search...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type='submit'>
                <SearchIcon className="search-icon" />
            </button>
        </form>
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
