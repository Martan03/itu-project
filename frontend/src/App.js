import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Calendar from "./pages/Calendar";
import PastVacations from "./pages/PastVacations";
import Settings from "./pages/Settings";
import UpcomingVacations from "./pages/UpcomingVacations";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<UpcomingVacations />}/>
                <Route path='/calendar' element={<Calendar />}/>
                <Route path='/past' element={<PastVacations />}/>
                <Route path='/settings' element={<Settings />}/>
            </Routes>
        </Router>
    );
}

export default App;
