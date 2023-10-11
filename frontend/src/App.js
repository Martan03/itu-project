import { React, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Calendar from "./pages/Calendar";
import PastVacations from "./pages/PastVacations";
import Settings from "./pages/Settings";
import UpcomingVacations from "./pages/UpcomingVacations";
import Vacations from "./pages/Vacations";

function App() {
    const [query, setQuery] = useState('');

    return (
        <Router>
            <Routes>
                <Route exact path='/' element={
                    <UpcomingVacations search={{query, setQuery}} />
                }/>
                <Route path='/calendar' element={
                    <Calendar search={{query, setQuery}} />
                }/>
                <Route path='/past' element={
                    <PastVacations search={{query, setQuery}} />
                }/>
                <Route path='/settings' element={
                    <Settings search={{query, setQuery}} />
                }/>
                <Route path='/vacations' element={
                    <Vacations search={{query, setQuery}} />
                }/>
            </Routes>
        </Router>
    );
}

export default App;
