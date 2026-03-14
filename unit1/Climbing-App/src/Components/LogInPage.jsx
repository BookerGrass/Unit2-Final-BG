import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import FormField from "./FormField";
import "./Main.css";

// set up login page
function LoginPage() {
  // set up state for username, password, error message, success message, and isSubmitting, also get the navigate function from react router to navigate to the home page on successful login
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // set up form validation to ensure that the username and password fields are not empty before allowing the user to submit the form, also added a check to prevent multiple submissions while the form is already being submitted
  const usernameValid = username.trim() !== "";
  const passwordValid = password.trim() !== "";
  const isFormValid = usernameValid && passwordValid;

  // set up handleSubmit function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    // set up base URL for the API, using an environment variable if available, otherwise defaulting to localhost, then make a GET request to the server to fetch the user with the provided username, and handle error states for if the user is not found or if there is an issue with the server
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
        localStorage.setItem(
          "loggedInUsername",
          user.username ?? username.trim(),
        );
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
    //renders the login page with a form for the username and password, and displays error or success messages based on the login attempt, also includes buttons to navigate to the home page on successful login and includes a navbar and footer
    <div>
      <Navbar />
      <form className="flex-item" onSubmit={handleSubmit}>
        <h1 className="title">Log In</h1>
        <FormField
          id="username"
          label="Username: "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
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

        {errorMessage && <p>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}

        {successMessage && (
          <button
            className="submit"
            type="button"
            onClick={() => navigate("/home")}
          >
            Go to Home Page!
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
