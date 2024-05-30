import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Users from './users';
import WebSocketComponent from './websocket';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/websocket" element={<WebSocketComponent />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
