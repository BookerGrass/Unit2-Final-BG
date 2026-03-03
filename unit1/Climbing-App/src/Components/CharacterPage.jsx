import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import "./Main.css";
import confetti from "canvas-confetti";

function CreateBuddy() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const [selectedImage, setSelectedImage] = useState("cat");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loggedInUsername = localStorage.getItem("loggedInUsername");
  const navigate = useNavigate();

  const imageOptions = {
    cat: "https://www.catbehaviourist.com/wp-content/uploads/2015/11/cat-in-tree-1.jpg",
    dog: "https://gripped.com/wp-content/uploads/2018/03/Biscuit-Dog.jpg",
    lizard:
      "https://images.pexels.com/photos/17020788/pexels-photo-17020788/free-photo-of-a-lizard-climbing-on-the-rock.jpeg",
  };

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

  const handleSave = async () => {
    const loggedInUsername = localStorage.getItem("loggedInUsername");

    if (!loggedInUsername) {
      setErrorMessage("You must be logged in to save a buddy.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

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
