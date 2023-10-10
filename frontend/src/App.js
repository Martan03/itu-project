import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Calendar from "./pages/Calendar";
import PastVacations from "./pages/PastVacations";
import Settings from "./pages/Settings";
import UpcomingVacations from "./pages/UpcomingVacations";
import Vacations from "./pages/Vacations";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<UpcomingVacations />}/>
                <Route path='/calendar' element={<Calendar />}/>
                <Route path='/past' element={<PastVacations />}/>
                <Route path='/settings' element={<Settings />}/>
                <Route path='/vacations' element={<Vacations />}/>
            </Routes>
        </Router>
    );
}

export default App;
