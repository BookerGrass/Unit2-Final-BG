import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./Main.css";
import Picture from "./images/Picture.jpg";

function AboutPage() {
  return (
    <div>
      <Navbar />
      <div className="flex-item">
        <h1 className="title">About Us</h1>
      </div>
      <div className="about-content">
        <img className="about-image" src={Picture} alt="Me and My Partner" />
        <p className="about-text">
          <span className="about-text-first">Climbing</span> is a huge part of
          me and my partner's lives, but naturally, like any skill, we are at
          different levels of experience and ability. In short, I climb higher
          grades than her. We love climbing together, but she would get
          discouraged when she didn't "climb as hard as she should". When I saw
          her get down on herself, it made me think of some way to fix this. I
          think that just walking through the doors of the gym is something to
          be celebrated, not just climbing hard, and I want to spread that
          feeling to every climber. Using me and my partner's love for climbing
          and goofy little guys, I came up with this site. I hope it helps
          others have a positive outlook on climbing.
          <br />
          <br />
          Just Keep Climbing!
          <br /> -Booker + Bri
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;
