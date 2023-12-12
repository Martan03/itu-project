import { React, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helper } from './PageStyleHelper.js';

import Calendar from "./pages/Calendar";
import PastVacations from "./pages/PastVacations";
import Settings from "./pages/Settings";
import UpcomingVacations from "./pages/UpcomingVacations";
import Vacations from "./pages/Vacations";
import Vacation from "./pages/Vacation";
import Trip from "./pages/Trip";
import EditVacation from "./pages/EditVacation";

import NotFound from "./pages/error/NotFound.js";
import ServerError from "./pages/error/ServerError.js";

function App() {
    const [query, setQuery] = useState('');
    const [small, setSmall] = useState(window.innerWidth < 1000);
    const [menuVis, setMenuVis] = useState(!small);

    Helper.updateFontSize(Helper.convertSliderValueToDiff(Helper.getCookieValue('sliderValue', 3)));
    Helper.updatePageTheme(Helper.convertThemeToBool(Helper.getCookieValue('selectedTheme', "Dark")));

    return (
        <Router>
            <Routes>
                <Route exact path='/' element={
                    <UpcomingVacations
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='/calendar' element={
                    <Calendar
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='/past' element={
                    <PastVacations
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='/settings' element={
                    <Settings
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='/vacations' element={
                    <Vacations
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='/vacation' element={
                    <Vacation
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='/trip' element={
                    <Trip
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='/edit-vacation' element={
                    <EditVacation
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='/500' element={
                    <ServerError
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
                <Route path='*' element={
                    <NotFound
                        search={{query, setQuery}}
                        menu={{small, setSmall, menuVis, setMenuVis}}
                    />
                }/>
            </Routes>
        </Router>
    );
}

export default App;
