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

  const navigate = useNavigate();

  const imageOptions = {
    cat: "https://www.catbehaviourist.com/wp-content/uploads/2015/11/cat-in-tree-1.jpg",
    dog: "https://gripped.com/wp-content/uploads/2018/03/Biscuit-Dog.jpg",
    lizard:
      "https://images.pexels.com/photos/17020788/pexels-photo-17020788/free-photo-of-a-lizard-climbing-on-the-rock.jpeg",
  };

  const handleChange = (e) => {
    triggerConfetti();
    setSelectedImage(e.target.value);
  };

  const handleSave = () => {
    navigate("/home", { state: { image: imageOptions[selectedImage] } });
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
        >
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="lizard">Lizard</option>
        </select>
        <button onClick={handleSave} className="save-buddy">
          Save Your Buddy
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
