import React from "react";
import Navbar from "./Components/NavBar";
import HomePage from "./Components/HomePage";
import CreateBuddy from "./Components/CharacterPage";
import SignUp from "./Components/SignUpPage";
import LandingScreen from "./Components/LandingScreen";
import AboutPage from "./Components/AboutPage";
import LogIn from "./Components/LogInPage";
import SettingsPage from "./Components/SettingsPage";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  // set up the main app component with routes for the landing screen, home page, create buddy page, signup page, about page, login page, and settings page, using react router for navigation
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create" element={<CreateBuddy />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
