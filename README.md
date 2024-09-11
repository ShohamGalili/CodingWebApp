# Coding Web App

### Project Overview

**Coding Web App** is an interactive web platform designed to enhance collaborative coding between mentors and students in real-time. It allows students and mentors to work together on solving coding problems using shared code blocks. The web application supports real-time updates through websockets, making it ideal for educational purposes like coding workshops or live coding sessions.

### Features

- Real-time collaborative coding with socket integration.
- Separate roles for mentors and students.
- A lobby system that allows users to choose from various coding problems.
- Mentors can guide multiple students in a single session.
- MongoDB integration for storing code block states and user information.
- Dynamic user counts (tracks how many students are active in each session).

### Folder Structure

- `client/`: Contains the frontend of the application built with React.
- `server/`: Contains the backend API and socket server built with Node.js and Express.
- `models/`: Contains MongoDB schemas for storing code block and user data.
