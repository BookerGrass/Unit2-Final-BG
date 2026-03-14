import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import "./Main.css";
import confetti from "canvas-confetti";

// set up create buddy page where users can pick what their buddy looks like, also added confetti when they pick a new buddy, and a save button to save the buddy to the user's account, also added error handling for if the user is not logged in or if there is an issue with the server

function CreateBuddy() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // set up state for selected image, isSubmitting, and errorMessage, also get the logged in username from local storage and set up navigate function

  const [selectedImage, setSelectedImage] = useState("cat");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loggedInUsername = localStorage.getItem("loggedInUsername");
  const navigate = useNavigate();

  // set up image options for the dropdown menu

  const imageOptions = {
    cat: "https://www.catbehaviourist.com/wp-content/uploads/2015/11/cat-in-tree-1.jpg",
    dog: "https://gripped.com/wp-content/uploads/2018/03/Biscuit-Dog.jpg",
    lizard:
      "https://images.pexels.com/photos/17020788/pexels-photo-17020788/free-photo-of-a-lizard-climbing-on-the-rock.jpeg",
  };

  // if the user is not logged in, show a message and buttons to go to login or signup page

  if (!loggedInUsername) {
    return (
      <div>
        <Navbar />
        <main className="flex-item">
          <h1 className="title">Create Your Buddy</h1>
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

  const handleChange = (e) => {
    triggerConfetti();
    setSelectedImage(e.target.value);
  };

  // set up handleSave function to save the selected buddy to the user's account, also added error handling for if the user is not logged in or if there is an issue with the server

  const handleSave = async () => {
    const loggedInUsername = localStorage.getItem("loggedInUsername");

    if (!loggedInUsername) {
      setErrorMessage("You must be logged in to save a buddy.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // make a PUT request to the server to save the selected buddy to the user's account, also added error handling for if the user is not found or if there is an issue with the server

    try {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
      const response = await fetch(
        `${baseUrl}/api/users/username/${encodeURIComponent(loggedInUsername)}/buddy`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ buddy: selectedImage }),
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage("User not found.");
        } else {
          setErrorMessage("Failed to save buddy. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      const savedUser = await response.json();
      navigate("/home", { state: { image: imageOptions[selectedImage] } });
    } catch (error) {
      setErrorMessage("Cannot reach the server. Try again later.");
      setIsSubmitting(false);
    }
  };

  // render the create buddy page with a dropdown menu to select the buddy, a save button to save the buddy to the user's account, and display the selected buddy image, also show any error messages if there are any

  return (
    <div>
      <Navbar />
      <div className="flex-item">
        <h1 className="title">Create Your Buddy</h1>
        <p>Here you can pick what your Lil Guy will look like!</p>
        <label htmlFor="animalDropdown">Choose an animal: </label>
        <select
          id="animalDropdown"
          onChange={handleChange}
          value={selectedImage}
          disabled={isSubmitting}
        >
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="lizard">Lizard</option>
        </select>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button
          onClick={handleSave}
          className="save-buddy"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Your Buddy"}
        </button>
      </div>
      <div className="image-container">
        <img
          src={imageOptions[selectedImage]}
          alt={selectedImage}
          className="buddy-image"
        />
      </div>
      <Footer />
    </div>
  );
}

export default CreateBuddy;
