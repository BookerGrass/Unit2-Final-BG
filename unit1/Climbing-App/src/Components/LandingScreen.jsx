import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./LandingScreen.css";
import { Link } from "react-router-dom";

function LandingScreen() {
  return (
    <div>
      <Navbar />
      <div className="home-image">
        <img
          src="https://npr.brightspotcdn.com/dims4/default/a95eb8c/2147483647/strip/true/crop/1000x563+0+52/resize/1200x675!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fkwmu%2Ffiles%2F201607%2Fclimbsoill2.jpg"
          alt="Climber scaling a rock wall"
        />
        <div className="centered">
          <h1>Welcome To Climb Buddy!</h1>
          <h2>Sign Up Below</h2>
          <Link to="/signup">
            <button className="get-started">Get Started</button>
          </Link>
        </div>
      </div>
      <div className="testimonial-title">
        <h2>Here are some Reviews!</h2>
        <div className="flex-container">
          <div className="flex-item">
            John Smith
            <p>This is such a great app!</p>
          </div>
          <div className="flex-item">
            Joe Smith
            <p>This is such a great app!</p>
          </div>
          <div className="flex-item">
            Joanne Smith
            <p>This is such a great app!</p>
          </div>
          <div className="flex-item">
            Booker Grass
            <p>It's alright I guess</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingScreen;
