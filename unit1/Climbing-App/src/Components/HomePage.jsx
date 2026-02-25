import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./Main.css";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";

function getRandomStringFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function HomePage() {
  const quotes = [
    "Go You",
    "Have a low gravity day",
    "Just walking into the gym is a success",
    "Your current project is a future warmup",
  ];

  const [currentString, setCurrentString] = useState(() =>
    getRandomStringFromArray(quotes),
  );

  const [inProgressTasks, setInProgressTasks] = useState([
    "Send a Climb",
    "Try a climb outside of your normal tag range",
    "Stretch before climbing",
  ]);

  const [counts, setCounts] = useState([0, 0, 0]);

  const [achievedTasks, setAchievedTasks] = useState([]);

  const maxCount = 5;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const increment = (index) => {
    const newCounts = [...counts];

    if (newCounts[index] < maxCount) {
      newCounts[index] += 1;

      if (newCounts[index] === maxCount) {
        const completedTask = inProgressTasks[index];
        triggerConfetti();
        setAchievedTasks((prev) => [...prev, completedTask]);

        const updatedTasks = inProgressTasks.filter((_, i) => i !== index);
        const updatedCounts = newCounts.filter((_, i) => i !== index);

        setInProgressTasks(updatedTasks);
        setCounts(updatedCounts);

        return;
      }

      setCounts(newCounts);
    }
  };
  const location = useLocation();
  const image = location.state?.image;

  return (
    <div>
      <Navbar />
      <div className="home-image">
        <img
          src="https://npr.brightspotcdn.com/dims4/default/a95eb8c/2147483647/strip/true/crop/1000x563+0+52/resize/1200x675!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fkwmu%2Ffiles%2F201607%2Fclimbsoill2.jpg"
          alt="climbing gym"
        />
        <div className="centered">
          <h1>Welcome Back</h1>
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-item">
          <h2>In Progress</h2>
          <ol>
            {inProgressTasks.length === 0 ? (
              <p>All tasks completed!</p>
            ) : (
              inProgressTasks.map((task, index) => (
                <li key={task}>
                  {task} — {counts[index]}/5
                  <button
                    onClick={() => increment(index)}
                    disabled={counts[index] >= maxCount}
                  >
                    +1
                  </button>
                </li>
              ))
            )}
          </ol>
        </div>
        <div className="flex-item">
          <h2>Achievements</h2>
          <ol>
            {achievedTasks.length === 0 ? (
              <p>No achievements yet</p>
            ) : (
              achievedTasks.map((task, index) => <li key={task}>{task}</li>)
            )}
          </ol>
        </div>
        <div className="flex-item">
          <h2>Positive Quote of the Day</h2>
          <p>{currentString}</p>
        </div>
        {image ? (
          <img
            src={image}
            alt="Your Buddy"
            style={{ width: "250px", height: "auto", borderRadius: "12px" }}
            className="buddy-image"
          />
        ) : (
          <p>No buddy selected yet.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
