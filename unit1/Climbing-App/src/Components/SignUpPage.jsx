import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usernameValid = username.trim() !== "";
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const skillLevelValid = ["beginner", "intermediate", "advanced", "expert"].includes(skillLevel);
  const isFormValid = usernameValid && emailValid && passwordValid && skillLevelValid;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          skillLevel: skillLevel.toUpperCase(),
        }),
      });

      if (response.status === 201) {
        navigate("/create");
        return;
      }

      if (response.status === 409) {
        setErrorMessage("That username already exists. Please choose another one.");
        return;
      }

      setErrorMessage("Signup failed. Please try again.");
    } catch (error) {
      setErrorMessage("Cannot reach the server. Check that your backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <form className="flex-item" onSubmit={handleSubmit}>
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
        <label htmlFor="skillLevel">Skill Level: </label>
        <select
          id="skillLevel"
          name="skillLevel"
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
        <br />
        {errorMessage && <p>{errorMessage}</p>}
        <button className="submit" type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <img
        className="signup-image"
        src="https://climbsoill.com/wp-content/uploads/2024/07/gravity-lab-climb-so-ill-st-charles-768x768.webp"
        alt="Indoor climbing gym"
      />
      <Footer />
    </div>
  );
}

export default SignUp;
