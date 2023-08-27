# [Pure HTML Chatroom using Node.js](https://github.com/aulolua/chatroom)

This project demonstrates the creation of a simple chatroom application using Node.js on the server-side and pure HTML for the frontend. The application allows users to register, log in, and participate in a chatroom where they can send and receive messages in real-time.

## Features

- User registration and authentication
- Real-time chat functionality
- Message history persistence
- Simple and clean user interface using pure HTML

## How to Use

1. **Clone the Repository:** Clone this repository to your local machine.

2. **Install Dependencies:** Run the following command to install the required dependencies:

   ```
   npm install
   ```

3. **Run the Server:** Start the Node.js server by running:

   ```
   node index.js
   ```

   The server will start and listen on port 3000 by default.

4. **Access the Application:** Open your web browser and navigate to `http://localhost:3000`. You'll be redirected to the login page.

5. **Register a New Account:** Click the "Register" link on the login page to create a new account.

6. **Log In:** After registering, go back to the login page and log in using your newly created account.

7. **Chat:** Once logged in, you'll be redirected to the chatroom page. Here you can see the chat history and send messages to the chat.

## File Structure

- `index.js`: The main Node.js server script containing the server setup and logic.
- `users.json`: JSON file storing user information (username and password hashes).
- `messages.json`: JSON file storing chat messages.

## Frontend

The frontend is implemented using pure HTML. It includes a login page, a registration page, and a chatroom page. The styling is done using inline styles for simplicity.

## Backend

The server is implemented using Node.js's built-in `http` module. It handles user authentication, message sending, and chat history. User data and message history are stored in JSON files.

## Note

- This project is intended for educational purposes and demonstrates a basic implementation.
- In a real-world scenario, using plain HTML for the frontend and storing sensitive information (like passwords) in JSON files would not be secure. A more secure and robust solution would involve using a proper database for storing user information and employing encryption techniques for sensitive data.

## Live Demo

You can access a live demo of this chatroom project at [https://long-cherry-thread.glitch.me/](https://long-cherry-thread.glitch.me/). Keep in mind that the demo is reset every 2 hours.

---

Feel free to explore, modify, and build upon this project to enhance your understanding of Node.js and basic web development concepts. If you have any questions or encounter issues, don't hesitate to ask for help. Happy coding!
