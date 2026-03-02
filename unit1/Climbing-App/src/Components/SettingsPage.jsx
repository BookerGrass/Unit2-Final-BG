import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./Main.css";

function SettingsPage() {
  const loggedInUsername = localStorage.getItem("loggedInUsername");
  const [newUsername, setNewUsername] = useState(loggedInUsername ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loggedInUsername) {
    return (
      <div>
        <Navbar />
        <main className="flex-item">
          <h1 className="title">Settings</h1>
          <p>You need to be logged in to view this page.</p>
          <Link to="/login">
            <button className="submit" type="button">
              Go to Login
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const updateUser = async (baseUrl, body) => {
    const endpoints = [
      `${baseUrl}/api/users/username/${encodeURIComponent(loggedInUsername)}`,
      `${baseUrl}/api/users/${encodeURIComponent(loggedInUsername)}`,
    ];

    const methods = ["PUT", "PATCH"];

    for (const endpoint of endpoints) {
      for (const method of methods) {
        try {
          const response = await fetch(endpoint, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (response.ok) {
            return { ok: true };
          }

          if (response.status === 404) {
            return { ok: false, message: "User not found." };
          }
        } catch (error) {
          return {
            ok: false,
            message: "Cannot reach the server. Try again later.",
          };
        }
      }
    }

    return {
      ok: false,
      message: "Could not update account. Please try again later.",
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    const trimmedUsername = newUsername.trim();
    const wantsUsernameChange = trimmedUsername !== loggedInUsername;
    const wantsPasswordChange = newPassword.trim() !== "";

    if (!wantsUsernameChange && !wantsPasswordChange) {
      setErrorMessage("Make a change before saving your account settings.");
      return;
    }

    if (trimmedUsername === "") {
      setErrorMessage("Username cannot be blank.");
      return;
    }

    if (wantsPasswordChange && newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (wantsPasswordChange && newPassword !== confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    const body = {};

    if (wantsUsernameChange) {
      body.username = trimmedUsername;
    }

    if (wantsPasswordChange) {
      body.password = newPassword;
    }

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

    setIsSubmitting(true);

    const result = await updateUser(baseUrl, body);

    if (!result.ok) {
      setErrorMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    if (wantsUsernameChange) {
      localStorage.setItem("loggedInUsername", trimmedUsername);
    }

    setSuccessMessage("Account updated successfully.");
    setNewPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  };

  return (
    <div>
      <Navbar />
      <main className="flex-item">
        <h1 className="title">Settings</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="newUsername">Username: </label>
          <input
            type="text"
            id="newUsername"
            name="newUsername"
            value={newUsername}
            onChange={(event) => setNewUsername(event.target.value)}
            required
          />
          <br />

          <label htmlFor="newPassword">New Password: </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Leave blank to keep current password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <br />

          <label htmlFor="confirmPassword">Confirm New Password: </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <br />

          {errorMessage && <p>{errorMessage}</p>}
          {successMessage && <p>{successMessage}</p>}

          <button className="submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default SettingsPage;
