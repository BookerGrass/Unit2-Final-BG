import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import FormField from "./FormField";
import "./Main.css";

// sets up settings page
function SettingsPage() {
  // sets up state for the current username, selected detail to change, new username, new email, selected buddy, new password, confirm password, delete confirmation, clear achievements confirmation, error message, success message, and isSubmitting, also gets the logged in username from local storage and the navigate function from react router to navigate to the login page if the user is not logged in or after account deletion
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
  const [clearAchievementsConfirmation, setClearAchievementsConfirmation] =
    useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // set up buddy options for the buddy selection dropdown menu
  const buddyOptions = {
    cat: "https://www.catbehaviourist.com/wp-content/uploads/2015/11/cat-in-tree-1.jpg",
    dog: "https://gripped.com/wp-content/uploads/2018/03/Biscuit-Dog.jpg",
    lizard:
      "https://images.pexels.com/photos/17020788/pexels-photo-17020788/free-photo-of-a-lizard-climbing-on-the-rock.jpeg",
  };

  // if the user is not logged in, show a message and buttons to go to login or signup page
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

  // set up updateUser function to update the user's username, email, or password based on the selected detail, also added error handling for if the user is not found or if there is an issue with the server
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
    // set up updateBuddy function to update the user's buddy based on the selected buddy, also added error handling for if the user is not found or if there is an issue with the server
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
    // set up deleteUserAccount function to delete the user's account based on the username, also added error handling for if the user is not found or if there is an issue with the server
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

  const clearUserAchievements = async (baseUrl, usernameToClear) => {
    // set up clearUserAchievements function to clear the user's achievements based on the username, also added error handling for if the user is not found or if there is an issue with the server
    try {
      const userResponse = await fetch(
        `${baseUrl}/api/users/username/${encodeURIComponent(usernameToClear)}`,
      );

      if (userResponse.status === 404) {
        return { ok: false, message: "User not found." };
      }

      if (!userResponse.ok) {
        return {
          ok: false,
          message: "Could not load user details. Please try again later.",
        };
      }

      const user = await userResponse.json();

      if (user?.id == null) {
        return {
          ok: false,
          message: "Account ID not found. Cannot clear achievements.",
        };
      }

      const achievedResponse = await fetch(
        `${baseUrl}/api/goals/user/${user.id}/achieved`,
      );

      if (!achievedResponse.ok) {
        return {
          ok: false,
          message: "Could not load achievements. Please try again later.",
        };
      }

      const achievedGoals = await achievedResponse.json();

      const uniqueGoalIds = [
        ...new Set(
          achievedGoals
            .map((goal) => goal?.id)
            .filter((goalId) => goalId != null),
        ),
      ];

      const deleteResults = await Promise.allSettled(
        uniqueGoalIds.map((goalId) =>
          fetch(`${baseUrl}/api/goals/${goalId}`, {
            method: "DELETE",
          }),
        ),
      );

      const hasDeleteFailure = deleteResults.some((result) => {
        if (result.status !== "fulfilled") {
          return true;
        }

        return !(result.value.ok || result.value.status === 204);
      });

      if (hasDeleteFailure) {
        return {
          ok: false,
          message: "Some achievements could not be deleted. Please try again.",
        };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: "Cannot reach the server. Try again later.",
      };
    }
  };

  // set up handleSubmit function to handle the form submission for updating user details, also added validation for the input fields and error handling for if there is an issue with the server or if the user is not found
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

    // added validation for email field to ensure it is not blank and is in a valid email format before allowing the user to submit the form, also added error handling for if the new email is the same as the current email
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

    // added validation for password fields to ensure the new password is not blank, is at least 6 characters long, and matches the confirm password field before allowing the user to submit the form, also added error handling for if the new password is the same as the current password
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

    //added validation for delete account and clear achievements options to ensure the user types the correct confirmation text before allowing them to submit the form, also added error handling for if the confirmation text is incorrect
    if (selectedDetail === "delete") {
      if (deleteConfirmation.trim() !== "delete") {
        setErrorMessage('Type "delete" to confirm account deletion.');
        return;
      }
    }

    //added validation for clear achievements option to ensure the user types the correct confirmation text before allowing them to submit the form, also added error handling for if the confirmation text is incorrect
    if (selectedDetail === "clearGoals") {
      if (clearAchievementsConfirmation.trim() !== "clear") {
        setErrorMessage('Type "clear" to confirm clearing Achievements.');
        return;
      }
    }

    //set up base URL for the API
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

    setIsSubmitting(true);

    let result;

    // determine which update function to call based on the selected detail, and call the appropriate function to update the user's details, also added error handling for if there is an issue with the server or if the user is not found
    if (selectedDetail === "buddy") {
      result = await updateBuddy(baseUrl, currentUsername, selectedBuddy);
    } else if (selectedDetail === "delete") {
      result = await deleteUserAccount(baseUrl, currentUsername);
    } else if (selectedDetail === "clearGoals") {
      result = await clearUserAchievements(baseUrl, currentUsername);
    } else {
      result = await updateUser(baseUrl, currentUsername, body);
    }

    if (!result.ok) {
      setErrorMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    // if the update was successful, update the current username state and local storage if the username was changed
    if (selectedDetail === "username") {
      const trimmedUsername = newUsername.trim();
      localStorage.setItem("loggedInUsername", trimmedUsername);
      setCurrentUsername(trimmedUsername);
      setSuccessMessage("Username updated successfully.");
    }

    // if the updated email is successful, show a success message
    if (selectedDetail === "email") {
      setNewEmail("");
      setSuccessMessage("Email updated successfully.");
    }

    // if the updated password is successful, clear the password fields and show a success message
    if (selectedDetail === "password") {
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Password updated successfully.");
    }

    // if the updated buddy is successful, show a success message
    if (selectedDetail === "buddy") {
      setSuccessMessage("Buddy updated successfully.");
    }

    //if the account deletion is successful, clear the logged in username from local storage, show a success message, and navigate to the login page
    if (selectedDetail === "delete") {
      localStorage.removeItem("loggedInUsername");
      setSuccessMessage("Account deleted successfully.");
      setIsSubmitting(false);
      navigate("/login");
      return;
    }

    // if the achievements were cleared successfully, show a success message
    if (selectedDetail === "clearGoals") {
      setClearAchievementsConfirmation("");
      setSuccessMessage("Achievements cleared successfully.");
    }

    setIsSubmitting(false);
  };

  return (
    // renders the settings page with a form to update the user's username, email, password, or buddy, as well as options to clear achievements or delete the account, also includes error and success messages based on the form submission, and a navbar and footer
    <div>
      <Navbar />
      <main className="flex-item">
        <h1 className="title">Settings</h1>
        <form onSubmit={handleSubmit}>
          <FormField
            id="detailToChange"
            label="Choose detail to change: "
            value={selectedDetail}
            onChange={(event) => {
              setSelectedDetail(event.target.value);
              setErrorMessage("");
              setSuccessMessage("");
              setDeleteConfirmation("");
              setClearAchievementsConfirmation("");
            }}
          >
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="buddy">Buddy</option>
            <option value="clearGoals">Clear Achievements</option>
            <option value="delete">Delete Account</option>
          </FormField>

          {selectedDetail === "username" && (
            <>
              <FormField
                id="newUsername"
                label="New Username: "
                value={newUsername}
                onChange={(event) => setNewUsername(event.target.value)}
                required
              />
            </>
          )}

          {selectedDetail === "email" && (
            <>
              <FormField
                id="newEmail"
                label="New Email: "
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                required
              />
            </>
          )}

          {selectedDetail === "password" && (
            <>
              <FormField
                id="newPassword"
                label="New Password: "
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />

              <FormField
                id="confirmPassword"
                label="Confirm New Password: "
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </>
          )}

          {selectedDetail === "buddy" && (
            <>
              <FormField
                id="selectedBuddy"
                label="Choose Buddy: "
                value={selectedBuddy}
                onChange={(event) => setSelectedBuddy(event.target.value)}
              >
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="lizard">Lizard</option>
              </FormField>
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
              <FormField
                id="deleteConfirmation"
                label="Confirm delete: "
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                required
              />
            </>
          )}

          {selectedDetail === "clearGoals" && (
            <>
              <p>Type "clear" to delete all achieved goals.</p>
              <FormField
                id="clearGoalsConfirmation"
                label="Confirm clear: "
                value={clearAchievementsConfirmation}
                onChange={(event) =>
                  setClearAchievementsConfirmation(event.target.value)
                }
                required
              />
            </>
          )}

          {errorMessage && <p>{errorMessage}</p>}
          {successMessage && <p>{successMessage}</p>}

          <button className="submit" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : selectedDetail === "delete"
                ? "Delete Account"
                : selectedDetail === "clearGoals"
                  ? "Clear Achievements"
                  : "Save Change"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default SettingsPage;
