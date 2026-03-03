import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./Main.css";

function SettingsPage() {
  const storedUsername = localStorage.getItem("loggedInUsername");
  const [currentUsername, setCurrentUsername] = useState(storedUsername ?? "");
  const [selectedDetail, setSelectedDetail] = useState("username");
  const [newUsername, setNewUsername] = useState(storedUsername ?? "");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!storedUsername) {
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

  const updateUser = async (baseUrl, usernameToUpdate, body) => {
    const endpoints = [
      `${baseUrl}/api/users/username/${encodeURIComponent(usernameToUpdate)}`,
      `${baseUrl}/api/users/${encodeURIComponent(usernameToUpdate)}`,
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

    const body = {};

    if (selectedDetail === "username") {
      const trimmedUsername = newUsername.trim();

      if (trimmedUsername === "") {
        setErrorMessage("Username cannot be blank.");
        return;
      }

      if (trimmedUsername === currentUsername) {
        setErrorMessage("Please enter a different username.");
        return;
      }

      body.username = trimmedUsername;
    }

    if (selectedDetail === "email") {
      const trimmedEmail = newEmail.trim();

      if (trimmedEmail === "") {
        setErrorMessage("Email cannot be blank.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }

      body.email = trimmedEmail;
    }

    if (selectedDetail === "password") {
      if (newPassword.trim() === "") {
        setErrorMessage("Password cannot be blank.");
        return;
      }

      if (newPassword.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage("Password confirmation does not match.");
        return;
      }

      body.password = newPassword;
    }

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

    setIsSubmitting(true);

    const result = await updateUser(baseUrl, currentUsername, body);

    if (!result.ok) {
      setErrorMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    if (selectedDetail === "username") {
      const trimmedUsername = newUsername.trim();
      localStorage.setItem("loggedInUsername", trimmedUsername);
      setCurrentUsername(trimmedUsername);
      setSuccessMessage("Username updated successfully.");
    }

    if (selectedDetail === "email") {
      setNewEmail("");
      setSuccessMessage("Email updated successfully.");
    }

    if (selectedDetail === "password") {
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Password updated successfully.");
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <Navbar />
      <main className="flex-item">
        <h1 className="title">Settings</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="detailToChange">Choose detail to change: </label>
          <select
            id="detailToChange"
            name="detailToChange"
            value={selectedDetail}
            onChange={(event) => {
              setSelectedDetail(event.target.value);
              setErrorMessage("");
              setSuccessMessage("");
            }}
          >
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
          </select>
          <br />

          {selectedDetail === "username" && (
            <>
              <label htmlFor="newUsername">New Username: </label>
              <input
                type="text"
                id="newUsername"
                name="newUsername"
                value={newUsername}
                onChange={(event) => setNewUsername(event.target.value)}
                required
              />
              <br />
            </>
          )}

          {selectedDetail === "email" && (
            <>
              <label htmlFor="newEmail">New Email: </label>
              <input
                type="email"
                id="newEmail"
                name="newEmail"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                required
              />
              <br />
            </>
          )}

          {selectedDetail === "password" && (
            <>
              <label htmlFor="newPassword">New Password: </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              <br />

              <label htmlFor="confirmPassword">Confirm New Password: </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <br />
            </>
          )}

          {errorMessage && <p>{errorMessage}</p>}
          {successMessage && <p>{successMessage}</p>}

          <button className="submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Change"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default SettingsPage;
