import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import "./Main.css";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

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
  ];

  const [currentString, setCurrentString] = useState(() =>
    getRandomStringFromArray(quotes),
  );

  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [achievedTasks, setAchievedTasks] = useState([]);
  const [taskErrorMessage, setTaskErrorMessage] = useState("");

  const maxCount = 5;
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

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

  const handleLogout = () => {
    localStorage.removeItem("loggedInUsername");
    navigate("/login");
  };

  return (
    <div>
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
          <h2>Achievements</h2>
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
      <Footer />
    </div>
  );
}

export default HomePage;
