import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import FormField from "./FormField";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function SignUp() {
  // set up state for username, email, password, skill level, error message, success message, and isSubmitting, also get the navigate function from react router to navigate to the login page on successful signup
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const usernameValid = username.trim() !== "";
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const skillLevelValid = [
    "beginner",
    "intermediate",
    "advanced",
    "expert",
  ].includes(skillLevel);
  const isFormValid =
    usernameValid && emailValid && passwordValid && skillLevelValid;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    // set up base URL for the API, using an environment variable if available, otherwise defaulting to localhost, then make a POST request to the server to create a new user with the provided username, email, password, and skill level, and handle error states for if the username already exists or if there is an issue with the server
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/api/users`,
        {
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
        },
      );

      if (response.status === 201) {
        setSuccessMessage("Signup successful! You can now log in.");
        return;
      }

      if (response.status === 409) {
        setErrorMessage(
          "That username already exists. Please choose another one.",
        );
        return;
      }

      setErrorMessage("Signup failed. Please try again.");
    } catch (error) {
      setErrorMessage(
        "Cannot reach the server. Check that your backend is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    //renders the signup page with a form to create a new account, including fields for username, email, password, and skill level, as well as error and success messages based on the form submission, and a navbar and footer
    <div>
      <Navbar />
      <form className="flex-item" onSubmit={handleSubmit}>
        <h1 className="title">Sign Up Below</h1>
        <FormField
          id="username"
          label="Username: "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <FormField
          id="email"
          label="Email: "
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <FormField
          id="password"
          label="Password: "
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <FormField
          id="skillLevel"
          label="Skill Level: "
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </FormField>
        {errorMessage && <p>{errorMessage}</p>}
        <br />
        {successMessage && (
          <button
            className="submit"
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        )}
        <br />

        {!successMessage && (
          <button
            className="submit"
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
        {successMessage || (
          <p>
            Already have an account?{" "}
            <button
              className="link-button"
              type="button"
              onClick={() => navigate("/login")}
            >
              Log in here
            </button>
          </p>
        )}
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
