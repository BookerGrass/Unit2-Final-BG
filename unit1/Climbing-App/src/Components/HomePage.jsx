import React, { useEffect, useRef, useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./Main.css";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { Fireworks } from "@fireworks-js/react";

function getRandomStringFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const buddyImageOptions = {
  cat: "https://www.catbehaviourist.com/wp-content/uploads/2015/11/cat-in-tree-1.jpg",
  dog: "https://gripped.com/wp-content/uploads/2018/03/Biscuit-Dog.jpg",
  lizard:
    "https://images.pexels.com/photos/17020788/pexels-photo-17020788/free-photo-of-a-lizard-climbing-on-the-rock.jpeg",
};

function resolveBuddyImage(buddyValue) {
  if (!buddyValue) {
    return "";
  }

  if (buddyImageOptions[buddyValue]) {
    return buddyImageOptions[buddyValue];
  }

  if (typeof buddyValue === "string" && /^https?:\/\//.test(buddyValue)) {
    return buddyValue;
  }

  return "";
}

function HomePage() {
  const loggedInUsername = localStorage.getItem("loggedInUsername");
  const navigate = useNavigate();
  const location = useLocation();
  const buddyFromRoute = location.state?.image;
  const [buddyImage, setBuddyImage] = useState(buddyFromRoute ?? "");

  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const quotes = [
    "Go You",
    "Have a low gravity day",
    "Just walking into the gym is a success",
    "Your current project is a future warmup",
    "One more try",
    "Trust your feet",
    "Climb the problem, not your doubts",
    "Strong moves start with strong mindset",
    "Every fall teaches something",
    "Progress is built one attempt at a time",
    "Send season starts today",
    "You’re stronger than your last attempt",
    "Chalk up and try again",
    "The wall rewards persistence",
    "Small improvements add up",
    "Every climber started somewhere",
    "Grip it and believe",
    "You’re closer than you think",
    "Strong mind, strong send",
    "One hold at a time",
    "Your project won’t send itself",
    "Climb like you mean it",
    "The next move is yours",
    "Breathe, trust, move",
    "Good beta comes from trying",
    "Fall seven times, climb eight",
    "The send is coming",
    "Trust the process",
    "Your warmup is someone else’s project",
    "Climbing is solving puzzles with your body",
    "Chalk fixes many problems",
    "You’re stronger than yesterday",
    "Send it",
    "Every climber fights gravity",
    "Believe in the beta",
    "Just one more attempt",
    "The wall is your teacher",
    "Strong climbers keep trying",
    "Grip strength is temporary, determination is forever",
    "Stay on the wall",
    "You got this",
  ];

  const [currentString, setCurrentString] = useState(() =>
    getRandomStringFromArray(quotes),
  );

  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [achievedTasks, setAchievedTasks] = useState([]);
  const [dbAchievedCount, setDbAchievedCount] = useState(0);
  const [taskErrorMessage, setTaskErrorMessage] = useState("");
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const previousAchievedCountRef = useRef(0);

  const maxCount = 5;
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
  const earnedStars = Math.floor(dbAchievedCount / 5);

  if (!loggedInUsername) {
    return (
      <div>
        <Navbar />
        <main className="flex-item">
          <h1 className="title">Home</h1>
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

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };
  const START_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!isTimerRunning) return;
    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isTimerRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(START_TIME);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(START_TIME);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const fetchGoals = async (userIdParam) => {
    const id = userIdParam || userId;
    if (!id) return;

    try {
      setTaskErrorMessage("");
      const inProgressResponse = await fetch(
        `${baseUrl}/api/goals/user/${id}/in-progress`,
      );
      if (inProgressResponse.ok) {
        const inProgressGoals = await inProgressResponse.json();
        setInProgressTasks(inProgressGoals);
      }

      const achievedResponse = await fetch(
        `${baseUrl}/api/goals/user/${id}/achieved`,
      );
      if (achievedResponse.ok) {
        const achievedGoals = await achievedResponse.json();
        setAchievedTasks(achievedGoals);
        setDbAchievedCount(achievedGoals.length);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      setTaskErrorMessage("Could not load goals from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchUserAndGoals = async () => {
      if (!loggedInUsername) {
        return;
      }

      try {
        const response = await fetch(
          `${baseUrl}/api/users/username/${encodeURIComponent(loggedInUsername)}`,
        );

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const user = await response.json();

        if (isCancelled) return;

        setUserId(user.id);

        const resolvedBuddyImage = resolveBuddyImage(user.buddy);
        if (resolvedBuddyImage) {
          setBuddyImage(resolvedBuddyImage);
        }

        await fetchGoals(user.id);
      } catch (error) {
        console.error("Error fetching user or goals:", error);
        setIsLoading(false);
      }
    };

    fetchUserAndGoals();

    return () => {
      isCancelled = true;
    };
  }, [loggedInUsername]);
  useEffect(() => {
    const previousCount = previousAchievedCountRef.current;
    const currentCount = achievedTasks.length;

    if (previousCount < 5 && currentCount === 5) {
      setShowFireworks(true);

      const timeoutId = setTimeout(() => {
        setShowFireworks(false);
      }, 5000);

      previousAchievedCountRef.current = currentCount;

      return () => clearTimeout(timeoutId);
    }

    previousAchievedCountRef.current = currentCount;
  }, [achievedTasks.length]);

  const increment = async (goal) => {
    if (!userId) return;

    setTaskErrorMessage("");
    const nextMaxCount = goal.maxCount ?? maxCount;
    const currentCount = goal.currentCount ?? 0;
    const newCount = Math.min(currentCount + 1, nextMaxCount);
    const achieved = newCount >= nextMaxCount;

    try {
      const response = await fetch(`${baseUrl}/api/goals/${goal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: goal.id,
          userId,
          taskName: goal.taskName,
          currentCount: newCount,
          maxCount: nextMaxCount,
          achieved,
        }),
      });

      if (!response.ok) {
        setTaskErrorMessage("Could not update task progress.");
        return;
      }

      if (achieved) {
        triggerConfetti();
        setInProgressTasks((prev) =>
          prev.filter((item) => item.id !== goal.id),
        );

        setAchievedTasks((prev) => [
          ...prev,
          {
            ...goal,
            currentCount: newCount,
            maxCount: nextMaxCount,
            achieved: true,
          },
        ]);
      } else {
        setInProgressTasks((prev) =>
          prev.map((item) =>
            item.id === goal.id ? { ...item, currentCount: newCount } : item,
          ),
        );
      }

      await fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
      setTaskErrorMessage("Could not update task progress.");
    }
  };

  const handleAddTask = async (event) => {
    event.preventDefault();

    if (!userId) return;
    setTaskErrorMessage("");

    const trimmedTask = newTask.trim();

    if (!trimmedTask) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          taskName: trimmedTask,
          currentCount: 0,
          maxCount: maxCount,
          achieved: false,
        }),
      });

      if (response.ok) {
        setNewTask("");
        await fetchGoals();
        return;
      }

      setTaskErrorMessage("Could not create task.");
    } catch (error) {
      console.error("Error creating goal:", error);
      setTaskErrorMessage("Could not create task.");
    }
  };

  const handleDeleteInProgressTask = async (goalId) => {
    if (!userId) return;

    const didConfirmDelete = window.confirm(
      "Are you sure you want to delete this in-progress task?",
    );

    if (!didConfirmDelete) {
      return;
    }

    setTaskErrorMessage("");

    try {
      const response = await fetch(`${baseUrl}/api/goals/${goalId}`, {
        method: "DELETE",
      });

      if (!(response.ok || response.status === 204)) {
        setTaskErrorMessage("Could not delete task.");
        return;
      }

      setInProgressTasks((prev) => prev.filter((goal) => goal.id !== goalId));
      await fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
      setTaskErrorMessage("Could not delete task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUsername");
    navigate("/login");
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowHelpPopup(true)}
        style={{
          position: "fixed",
          right: "16px",
          bottom: "16px",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          zIndex: 10000,
          cursor: "pointer",
        }}
      >
        ?
      </button>

      {showHelpPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "420px",
              width: "90%",
            }}
          >
            <h3>Home Page Help</h3>
            <p>
              - In Progress: track goals and click +1 to move toward completion.
              <p>
                (Some good goals could be "Come to the climbing gym", "Climb for
                30 minutes", or "Complete 3 boulder problems")
              </p>
            </p>
            <p>
              - Achievements: completed goals appear here and can be deleted
              through account settings.
            </p>
            <p>- Buddy: shows your selected climbing buddy image.</p>
            <button type="button" onClick={() => setShowHelpPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showFireworks && (
        <Fireworks
          options={{
            rocketsPoint: { min: 0, max: 100 },
          }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
      <Navbar />
      <div className="home-image">
        <img
          src="https://npr.brightspotcdn.com/dims4/default/a95eb8c/2147483647/strip/true/crop/1000x563+0+52/resize/1200x675!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fkwmu%2Ffiles%2F201607%2Fclimbsoill2.jpg"
          alt="climbing gym"
        />
        <div className="centered">
          <h1>
            Welcome Back
            {loggedInUsername ? `, ${loggedInUsername}` : ""}!
          </h1>
          {loggedInUsername && (
            <button className="submit" type="button" onClick={handleLogout}>
              Log Out
            </button>
          )}
        </div>
      </div>
      {earnedStars > 0 && (
        <div
          style={{ textAlign: "center", fontSize: "2rem", marginTop: "8px" }}
        >
          {"⭐".repeat(earnedStars)}
        </div>
      )}
      <div className="flex-container">
        <div className="flex-item">
          <h2>In Progress</h2>

          {isLoading ? (
            <p>Loading goals...</p>
          ) : (
            <ol>
              {inProgressTasks.length === 0 ? (
                <p>No In Progress Tasks</p>
              ) : (
                inProgressTasks.map((goal) => (
                  <li key={goal.id}>
                    {goal.taskName} — {goal.currentCount}/{goal.maxCount}
                    <button
                      onClick={() => increment(goal)}
                      disabled={goal.currentCount >= goal.maxCount}
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteInProgressTask(goal.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ol>
          )}

          {taskErrorMessage && <p>{taskErrorMessage}</p>}

          <form onSubmit={handleAddTask}>
            <label htmlFor="newTask">Add a task: </label>
            <input
              type="text"
              id="newTask"
              name="newTask"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
            />
            <button type="submit">Add Task</button>
          </form>
        </div>
        <div className="flex-item">
          <h2
            onMouseEnter={() => setShowSecretMessage(true)}
            onMouseLeave={() => setShowSecretMessage(false)}
          >
            Achievements
          </h2>
          {showSecretMessage && (
            <p>Get to 5 achievements to unlock a special reward!</p>
          )}
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {isLoading ? (
              <p>Loading achievements...</p>
            ) : (
              <ol>
                {achievedTasks.length === 0 ? (
                  <p>No achievements yet</p>
                ) : (
                  achievedTasks.map((goal) => (
                    <li key={goal.id}>{goal.taskName}</li>
                  ))
                )}
              </ol>
            )}
          </div>

          {taskErrorMessage && <p>{taskErrorMessage}</p>}
        </div>
        <div className="flex-item">
          <h2>Positive Quote of the Day</h2>
          <p>{currentString}</p>
        </div>
        {buddyImage ? (
          <img
            src={buddyImage}
            alt="Your Buddy"
            style={{ width: "250px", height: "auto", borderRadius: "12px" }}
            className="buddy-image"
          />
        ) : (
          <p>No buddy selected yet.</p>
        )}
      </div>
      <div className="flex-item">
        <h2>Rest Timer</h2>
        <p>
          {minutes}:{seconds}
        </p>

        <button type="button" onClick={startTimer} disabled={isTimerRunning}>
          Start 5:00
        </button>
        <button type="button" onClick={stopTimer} disabled={!isTimerRunning}>
          Pause
        </button>
        <button type="button" onClick={resetTimer}>
          Reset
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
