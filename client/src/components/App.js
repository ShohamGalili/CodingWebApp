import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './Lobby';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Lobby />} />
            </Routes>
        </Router>
    );
}

export default App;
