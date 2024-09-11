
### Server Overview

The backend of the **Coding Web App** is built with Node.js, Express, and Socket.io to handle real-time collaboration. The server uses MongoDB to store code block data, track users, and manage code block solutions.

### Features

- RESTful API for managing code blocks and users.
- Real-time websocket connection using Socket.io.
- MongoDB integration for persisting code block data.
- Dynamic tracking of users in code blocks.

### How to Run the Server

1. Navigate to the `server` folder.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up the MongoDB connection. In the .env file, specify the MongoDB URI:
    ```bash
   MONGO_URI=mongodb://localhost:27017/your-local-db
   ```
   Replace your-local-db with your MongoDB database name.
4. Start the server:
    ```bash
   npm start
   ```
5. The server will run on http://localhost:5000.

## API Endpoints

- **POST /api/codeblocks**: Create a new code block.
- **GET /api/codeblocks**: Retrieve all available code blocks.
- **POST /api/users**: Add a new user to the database.
- **PUT /api/codeblocks/:id**: Update the content of a code block.

## Real-Time Events (Socket.io)

- **joinCodeBlock**: When a user joins a code block, they are assigned a role and receive real-time code updates.
- **codeUpdate**: This event triggers when a user updates the code, sending the new code to all users in the same code block.
- **mentorLeft**: Notifies students when the mentor has left the code block and redirects them to the lobby.
