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
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create" element={<CreateBuddy />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
