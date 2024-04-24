import './App.css';
import React from 'react';
import {Routes, Route, Link} from "react-router-dom";
import LoginForm from './components/Login-form';
import Register from './components/Register';
import ServiceProvider from './components/serviceProvider';
import Headers from './components/headers/headers';

export default function App() {
  return (
    <div className="App">
      <h1>Lens Locater</h1> 
      <Link to="/Login-form">Login</Link> |{' '}
      <Link to="/Register">Register</Link>

      <Routes>
        <Route path="/Login-form" element={<LoginForm/>}></Route>
        <Route path="/Register" element={<Register/>}></Route>
        <Route path="/serviceProvider" element={<ServiceProvider/>}></Route>
      </Routes>
    </div>
  );
}

