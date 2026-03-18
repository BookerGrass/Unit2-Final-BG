# 🧗 Climb Buddy 

## 🚀 Project Description 

Climb Buddy is a climbing-focused productivity and motivation web app that helps users stay consistent with their training sessions while keeping climbing fun. After signing up and logging in, climbers can choose a climbing buddy avatar, track goals in progress and achieved goals, and get encouragement through randomized motivational messages.

The app also includes session-friendly features like a rest timer and visual celebration effects (confetti and fireworks) when milestones are reached, creating a lightweight companion experience that makes training more fun and habit-forming.

## ✨ Features 

- 🔐 User authentication flow (sign up / login)
- 🐾 Climbing buddy avatar selection
- 🎯 Goal tracking with in-progress and achieved states
- 💬 Randomized motivational messages for encouragement
- ⏱️ Rest timer for training sessions
- 🎉 Confetti and fireworks celebration effects on milestones

## 🛠️ Tech Stack

This full-stack project leverages a modern, decoupled MVC architecture with multiple integrated dependencies.

### 🎨 Front End

|                                                                                                             Technology | Description                                                                      |
| ---------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------- |
|     ![JavaScript](https://img.shields.io/badge/JavaScript-F0DB4F?style=for-the-badge&logo=javascript&logoColor=323330) | Core programming language, native to all browsers for dynamic user experience    |
|                    ![React](https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=react&logoColor=20232A) | Efficient, interactive UI through component-based architecture and a virtual DOM |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white) | Declarative, component-based navigation and routing                              |
|                        ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Quick cold start and near-instantaneous Hot Module Replacement (HMR)             |
|                    ![CSS](https://img.shields.io/badge/CSS-rebeccapurple?style=for-the-badge&logo=css&logoColor=white) | Styling, layout, responsiveness, and accessibility improvements                  |

### 🔧 Back End & Database

|                                                                                                        Technology | Description                                                                                 |
| ----------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------ |
|                                             ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge) | Core programming language for robust and scalable web applications                          |
| ![SpringBoot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) | Rapid creation of standalone application with a RESTful API                                 |
|          ![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white) | Comprehensive, convention-over-configuration approach that simplifies dependency management |
|    ![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white) | Object-Relational Mapping (ORM) tool for database interactions                              |
|                                           ![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge) | Relational database with structured data storage                                            |

## 💻 Quick Startup Checklist for Frontend Using VSCode 

1. Fork this repository on GitHub.
2. Clone your fork to your machine:

```bash
git clone https://github.com/<your-username>/Unit2-Final-BG.git
```

3. Move into the project folder:

```bash
cd Unit2-Final-BG/unit1/Climbing-App
```

4. Install dependencies:

```bash
npm install
```

5. ⚙️ (Optional) Configure the backend API URL 
   The app defaults to `http://localhost:8080` if no environment variable is set.
   To use a different backend, create a `.env` file in this folder and add:

```env
VITE_API_BASE_URL=http://localhost:8080
```

6. ▶️ Run the app in VSCode 

```bash
npm run dev
```

7. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## 🛠️ Quick Startup Checklist for Backend Using IntelliJ and MySQL 

1. ☕ Install Java 21 

2. 🐬 Install and start MySQL 

3. Make sure MySQL has a root user with password 3241 or edit src/main/resources/application.properties to match your own MySQL credentials

4. Open a terminal in the project folder and run:

```bash
.\mvnw.cmd spring-boot:run
```

## 📐 Links to Wireframes and ERDs

1. <a href="https://wireframe.cc/pro/ppp/a0e3de399-990112#2f4738f7-d911-43c3-8446-23b2e826f03f" alt="Wireframe">Wireframes</a>

2. <a href="https://www.figma.com/board/Q3s4Kdj56srdaOL0MasgIb/Untitled?node-id=0-1&t=V27JcK4DdXZc27el-1" alt="ERDs">ERDs</a>

## 🔌 Backend API Endpoints 

Note: Endpoint paths can vary by backend controller setup. Update these to match your Spring Boot routes if needed.

Base URL (default local): `http://localhost:8080`

### 👤 Auth / User 

- `POST /users/register` - Create a new user account
- `POST /users/login` - Authenticate user and start session/token flow
- `GET /users/{id}` - Fetch a user profile by ID

### 🧩 Goals 

- `GET /goals/user/{userId}` - Get all goals for a user
- `GET /goals/user/{userId}?achieved=false` - Get active goals
- `GET /goals/user/{userId}?achieved=true` - Get achieved goals
- `POST /goals` - Create a new goal
- `PUT /goals/{goalId}` - Update goal details/status
- `DELETE /goals/{goalId}` - Delete a goal

## 🔮 Unsolved Problems and Future Features 

### ⚠️ Current Limitations

- 🔐 Authentication is currently based on username flow and local state, and still needs a full JWT/session-based security model.
- 🛡️ Error handling can be improved with clearer user-facing messages and retry options when backend requests fail.

### Future Features

- 📈 Progress analytics dashboard (weekly sends, completion streaks, goals over time).
- 🧠 Personalized motivation feed based on recent activity.
- 🧗 Route/project log for tracking specific climbs and attempts.
- 👥 Social features like friend sharing and challenge groups.
- 🎨 Buddy customization system with unlockable accessories based on achieved goals.

## 🧑‍💻 Designer & Programmer

Booker Grass - [@BookerGrass](https://github.com/BookerGrass) - [LinkedIn](linkedin.com/in/booker-grass-5b1b943a4/)