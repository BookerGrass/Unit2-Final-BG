import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./Main.css";

function SettingsPage() {
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem("loggedInUsername");
  const [currentUsername, setCurrentUsername] = useState(storedUsername ?? "");
  const [selectedDetail, setSelectedDetail] = useState("username");
  const [newUsername, setNewUsername] = useState(storedUsername ?? "");
  const [newEmail, setNewEmail] = useState("");
  const [selectedBuddy, setSelectedBuddy] = useState("cat");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buddyOptions = {
    cat: "https://www.catbehaviourist.com/wp-content/uploads/2015/11/cat-in-tree-1.jpg",
    dog: "https://gripped.com/wp-content/uploads/2018/03/Biscuit-Dog.jpg",
    lizard:
      "https://images.pexels.com/photos/17020788/pexels-photo-17020788/free-photo-of-a-lizard-climbing-on-the-rock.jpeg",
  };

  if (!storedUsername) {
    return (
      <div>
        <Navbar />
        <main className="flex-item">
          <h1 className="title">Settings</h1>
          <p>You need to be logged in to view this page.</p>
          <button
            className="submit"
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
          <button
            className="submit"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Go to Signup
          </button>
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

  const updateBuddy = async (baseUrl, usernameToUpdate, buddy) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/users/username/${encodeURIComponent(usernameToUpdate)}/buddy`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ buddy }),
        },
      );

      if (response.ok) {
        return { ok: true };
      }

      if (response.status === 404) {
        return { ok: false, message: "User not found." };
      }

      return {
        ok: false,
        message: "Could not update buddy. Please try again later.",
      };
    } catch (error) {
      return {
        ok: false,
        message: "Cannot reach the server. Try again later.",
      };
    }
  };

  const deleteUserAccount = async (baseUrl, usernameToDelete) => {
    try {
      const userResponse = await fetch(
        `${baseUrl}/api/users/username/${encodeURIComponent(usernameToDelete)}`,
      );

      if (userResponse.status === 404) {
        return { ok: false, message: "User not found." };
      }

      if (!userResponse.ok) {
        return {
          ok: false,
          message: "Could not find account. Please try again later.",
        };
      }

      const user = await userResponse.json();

      if (user?.id == null) {
        return {
          ok: false,
          message: "Account ID not found. Cannot delete account.",
        };
      }

      const deleteResponse = await fetch(`${baseUrl}/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (deleteResponse.status === 404) {
        return { ok: false, message: "User not found." };
      }

      if (deleteResponse.status === 204 || deleteResponse.ok) {
        return { ok: true };
      }

      return {
        ok: false,
        message: "Could not delete account. Please try again later.",
      };
    } catch (error) {
      return {
        ok: false,
        message: "Cannot reach the server. Try again later.",
      };
    }
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

    if (selectedDetail === "delete") {
      if (deleteConfirmation.trim() !== "delete") {
        setErrorMessage('Type "delete" to confirm account deletion.');
        return;
      }
    }

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

    setIsSubmitting(true);

    let result;

    if (selectedDetail === "buddy") {
      result = await updateBuddy(baseUrl, currentUsername, selectedBuddy);
    } else if (selectedDetail === "delete") {
      result = await deleteUserAccount(baseUrl, currentUsername);
    } else {
      result = await updateUser(baseUrl, currentUsername, body);
    }

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

    if (selectedDetail === "buddy") {
      setSuccessMessage("Buddy updated successfully.");
    }

    if (selectedDetail === "delete") {
      localStorage.removeItem("loggedInUsername");
      setSuccessMessage("Account deleted successfully.");
      setIsSubmitting(false);
      navigate("/login");
      return;
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
              setDeleteConfirmation("");
            }}
          >
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="buddy">Buddy</option>
            <option value="delete">Delete Account</option>
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

          {selectedDetail === "buddy" && (
            <>
              <label htmlFor="selectedBuddy">Choose Buddy: </label>
              <select
                id="selectedBuddy"
                name="selectedBuddy"
                value={selectedBuddy}
                onChange={(event) => setSelectedBuddy(event.target.value)}
              >
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="lizard">Lizard</option>
              </select>
              <br />
              <img
                src={buddyOptions[selectedBuddy]}
                alt={selectedBuddy}
                className="buddy-image"
                style={{ width: "250px", height: "auto", borderRadius: "12px" }}
              />
              <br />
            </>
          )}

          {selectedDetail === "delete" && (
            <>
              <p>Type "delete" to permanently remove your account.</p>
              <label htmlFor="deleteConfirmation">Confirm delete: </label>
              <input
                type="text"
                id="deleteConfirmation"
                name="deleteConfirmation"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                required
              />
              <br />
            </>
          )}

          {errorMessage && <p>{errorMessage}</p>}
          {successMessage && <p>{successMessage}</p>}

          <button className="submit" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : selectedDetail === "delete"
                ? "Delete Account"
                : "Save Change"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default SettingsPage;
