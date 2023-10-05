import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Calendar from "./pages/Calendar";
import PastTrips from "./pages/PastTrips";
import Settings from "./pages/Settings";
import UpcomingTrips from "./pages/UpcomingTrips";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<UpcomingTrips />}/>
                <Route path='/calendar' element={<Calendar />}/>
                <Route path='/past' element={<PastTrips />}/>
                <Route path='/settings' element={<Settings />}/>
            </Routes>
        </Router>
    );
}

export default App;
