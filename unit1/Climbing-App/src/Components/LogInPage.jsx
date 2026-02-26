import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./Main.css";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameValid = username.trim() !== "";
  const passwordValid = password.trim() !== "";
  const isFormValid = usernameValid && passwordValid;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

    try {
      const response = await fetch(
        `${baseUrl}/api/users/username/${encodeURIComponent(username.trim())}`,
      );

      if (response.status === 404) {
        setErrorMessage("User not found.");
        return;
      }

      if (!response.ok) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      const user = await response.json();

      if (user.password === password) {
        setSuccessMessage("Login successful.");
        return;
      }

      setErrorMessage("Invalid username or password.");
    } catch (error) {
      setErrorMessage(
        "Cannot reach the server. Check that your backend is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <form className="flex-item" onSubmit={handleSubmit}>
        <h1 className="title">Log In</h1>

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

        {errorMessage && <p>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}

        {successMessage && (
          <button
            className="submit"
            type="button"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        )}

        {!successMessage && (
          <button
            className="submit"
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Log In"}
          </button>
        )}
      </form>
      <Footer />
    </div>
  );
}

export default LoginPage;
