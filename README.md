# Coding Web App

Welcome to **Coding Web App**, an interactive platform designed to enhance collaborative coding in real-time! This application allows mentors and students to work together on coding challenges, share code blocks, and solve problems in a dynamic and engaging environment.

We hope you enjoy using this app, whether you are a mentor guiding students or a student working to improve your coding skills!

## Features

- **Real-Time Collaborative Coding**: With WebSocket integration, mentors and students can work together on the same code block, making live coding more efficient.
- **Roles**: Separate roles for mentors and students. Mentors can assist multiple students in a session, making it ideal for classroom environments or coding workshops.
- **Lobby System**: Users can join sessions via a lobby, where they can select from various coding problems to solve.
- **Session Tracking**: The app dynamically tracks how many students are active in each session, allowing for better session management.
- **MongoDB Integration**: Stores code block states and user information, ensuring data is saved and can be retrieved across sessions.

## Getting Started

Follow these steps to set up the **Coding Web App** on your local machine.

### Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (or a MongoDB Atlas account for cloud-based storage)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/coding-web-app.git
   cd coding-web-app
    ```
   
2. **Install dependencies for both the client and server:**
    ```bash 
   # Install server dependencies
    cd server
    npm install
    
    # Install client dependencies
    cd ../client
    npm install
   ```
   
3. **Start MongoDB (If using local MongoDB, ensure it's running):**
    ```bash
   mongod
    ```

4. **Run the app:**
   * Open a terminal for the server and run:
   ```bash
    cd server
    npm start
    ```
   * Open another terminal for the client and run:
    ```bash
    cd client
    npm start
    ```
   The client should open in your default browser at http://localhost:3000.

## Folder Structure

- `client/`: Contains the frontend of the application built with React. This includes the UI for the lobby, code block pages, and real-time collaboration features.
- `server/`: Houses the backend built with Node.js and Express. This folder contains the API and socket server for handling real-time communication.
- `models/`: MongoDB schemas for storing user data, code block states, and session details.

## How to Use

- **Lobby System**: Upon launching, users will enter a lobby where they can choose a coding challenge.
- **Mentor and Student Roles**: Mentors guide students by reviewing their code in real-time and offering feedback. Students can submit their code for review once completed.
- **Real-Time Collaboration**: Edits made by any user in a session will be visible to all other participants immediately.

## Video Explanation

You can watch a video explanation of the **Coding Web App** here:

[Watch Video](https://youtu.be/0YK0-spltvM)

## Live Demo

You can access the live version of the **Coding Web App** here:

[Live Demo](https://codingwebapp.vercel.app/)

---

Hope you enjoy using **Coding Web App**!

Made with ❤️ by Shoham Galili





