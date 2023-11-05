import { React, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helper } from './PageStyleHelper.js';

import Calendar from "./pages/Calendar";
import PastVacations from "./pages/PastVacations";
import Settings from "./pages/Settings";
import UpcomingVacations from "./pages/UpcomingVacations";
import Vacations from "./pages/Vacations";
import Vacation from "./pages/Vacation";
import EditVacation from "./pages/EditVacation";

function App() {
    const [query, setQuery] = useState('');

    Helper.updateFontSize(Helper.convertSliderValueToDiff(Helper.getCookieValue('sliderValue', 3)));
    Helper.updatePageTheme(Helper.convertThemeToBool(Helper.getCookieValue('selectedTheme', "Dark")));

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
                <Route path='/vacation' element={
                    <Vacation search={{query, setQuery}} />
                }/>
                <Route path='/edit-vacation' element={
                    <EditVacation search={{query, setQuery}} />
                }/>
            </Routes>
        </Router>
    );
}

export default App;
