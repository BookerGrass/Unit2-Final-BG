import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import "./Main.css";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const usernameValid = username.trim() !== "";
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const isFormValid = usernameValid && emailValid && passwordValid;

  return (
    <div>
      <Navbar />
      <form className="flex-item">
        <h1 className="title">Sign Up Below</h1>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <Link to={isFormValid ? "/create" : "#"}>
          <button className="submit" disabled={!isFormValid}>
            Submit
          </button>
        </Link>
      </form>
      <img
        className="signup-image"
        src="https://climbsoill.com/wp-content/uploads/2024/07/gravity-lab-climb-so-ill-st-charles-768x768.webp"
      />
      <Footer />
    </div>
  );
}

export default SignUp;
