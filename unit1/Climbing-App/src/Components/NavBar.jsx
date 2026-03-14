import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

// sets up nav bar component
function NavBar() {
  // sets up state for whether the mobile menu is open, checks if the user is logged in by looking for a logged in username in local storage, and gets the navigate function from react router to navigate to the login page on logout
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("loggedInUsername"));
  const navigate = useNavigate();

  // sets up handleLogout function to clear the logged in username from local storage and navigate to the login page when the user clicks the logout button
  const handleLogout = () => {
    localStorage.removeItem("loggedInUsername");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    //renders the nav bar with a logo that links to the home page, navigation links for home, signup, login, create buddy, about us, and settings, and conditionally renders the signup and login links if the user is not logged in, and a logout link if the user is logged in, also includes a hamburger menu toggle for mobile screens that shows or hides the navigation links when clicked
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={isLoggedIn ? "/home" : "/"} className="logo">
          ClimbBuddy
        </Link>
      </div>
      <button
        className="menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setIsOpen((s) => !s)}
      >
        ☰
      </button>
      <div className="navbar-center">
        <div className="navbar-right">
          <ul
            className="nav-links"
            style={{ display: isOpen ? "flex" : undefined }}
          >
            <li>
              <Link to="/home" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Log In
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/login" onClick={handleLogout}>
                  Log Out
                </Link>
              </li>
            )}
            <li>
              <Link to="/create" onClick={() => setIsOpen(false)}>
                Create Buddy
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="settings-link"
                aria-label="Settings"
              >
                ⚙️
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
