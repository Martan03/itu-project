import React from 'react';
import '../css/Navbar.css';

function SearchBar() {
    return (
        <input
            className='form-input'
            type='search'
            placeholder='Search...'
        />
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
