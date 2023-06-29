const http = require('http');
const url = require('url');
const crypto = require('crypto')
const fs = require('fs');

if (fs.existsSync('./users.json')) {
  fs.writeFileSync('./users.json','[]')
}

if (fs.existsSync('./messages.json')) {
  fs.writeFileSync('./messages.json','[]')
}

const port = 3000;
var users = JSON.parse(fs.readFileSync('./users.json').toString());
var messages = JSON.parse(fs.readFileSync('./users.json').toString());

setInterval(function() {
  fs.writeFileSync('./users.json',JSON.stringify(users))
  fs.writeFileSync('./messages.json',JSON.stringify(messages))
},500)

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/chat') {
    const sessionId = query.sessionId;
    const user = users.find(user => user.sessionId === sessionId);
    if (!user) {
      redirectToLogin(res);
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const formData = new URLSearchParams(body);
        const message = formData.get('message');
        if (message) {
          const newMessage = {
            username: user.username,
            content: message,
            timestamp: getCurrentTime()
          };
          messages.unshift(newMessage);
        }
        res.writeHead(302, { 'Location': `/chat?sessionId=${sessionId}` });
        res.end();
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const messageList = messages.map(msg => `<p>${msg.username} [${formatTime(msg.timestamp)}]: ${msg.content}</p>`).join('');
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Chat</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
            }
            h1 {
              margin-top: 0;
            }
            #message-input {
              width: 400px;
              padding: 10px;
              font-size: 16px;
            }
            #message-form {
              display: flex;
              margin-bottom: 20px;
            }
            #message-form input[type="text"] {
              flex: 1;
              margin-right: 10px;
            }
            #message-form input[type="submit"] {
              width: 100px;
            }
            #message-list {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            }
            #message-list p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome, ${user.username}!</h1>
            <div id="message-list">
              ${messageList}
            </div>
            <form id="message-form" action="/chat?sessionId=${sessionId}" method="post">
              <input type="text" name="message" id="message-input" autocomplete="off" required>
              <input type="submit" value="Send">
            </form>
          </div>
        </body>
        </html>
      `;
      res.write(html);
      res.end();
    }
  } else if (pathname === '/') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const formData = new URLSearchParams(body);
        const username = formData.get('username');
        const password = formData.get('password');
        if (authenticateUser(username, password)) {
          const sessionId = generateSessionId();
          users.push({ sessionId, username });
          res.writeHead(302, { 'Location': `/chat?sessionId=${sessionId}` });
          res.end();
        } else {
          res.statusCode = 401;
          res.end('Authentication failed');
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Login</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
            }
            h1 {
              margin-top: 0;
            }
            #login-form {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            #login-form input[type="text"],
            #login-form input[type="password"] {
              width: 300px;
              padding: 10px;
              font-size: 16px;
              margin-bottom: 10px;
            }
            #login-form input[type="submit"] {
              width: 100px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Login</h1>
            <form id="login-form" action="/" method="post">
              <input type="text" name="username" placeholder="Username" required>
              <input type="password" name="password" placeholder="Password" required>
              <input type="submit" value="Log in">
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </body>
        </html>
      `;
      res.write(html);
      res.end();
    }
  } else if (pathname === '/register') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const formData = new URLSearchParams(body);
        const username = formData.get('username');
        const password = formData.get('password');
        if (username && password) {
          if (isUsernameAvailable(username)) {
            createUser(username, password);
            res.writeHead(302, { 'Location': '/' });
            res.end();
          } else {
            res.statusCode = 409;
            res.end('Username already taken');
          }
        } else {
          res.statusCode = 400;
          res.end('Invalid username or password');
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Register</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
            }
            h1 {
              margin-top: 0;
            }
            #register-form {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            #register-form input[type="text"],
            #register-form input[type="password"] {
              width: 300px;
              padding: 10px;
              font-size: 16px;
              margin-bottom: 10px;
            }
            #register-form input[type="submit"] {
              width: 100px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Register</h1>
            <form id="register-form" action="/register" method="post">
              <input type="text" name="username" placeholder="Username" required>
              <input type="password" name="password" placeholder="Password" required>
              <input type="submit" value="Register">
            </form>
            <p>Already have an account? <a href="/">Log in</a></p>
          </div>
        </body>
        </html>
      `;
      res.write(html);
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

function redirectToLogin(res) {
  res.writeHead(302, { 'Location': '/' });
  res.end();
}

function getCurrentTime() {
  return Date.now();
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function authenticateUser(username, password) {
  const user = users.find(user => user.username === username && user.password === password);
  return !!user; // Returns true if user exists, false otherwise
}

function isUsernameAvailable(username) {
  return !users.some(user => user.username === username);
}

function createUser(username, password) {
  users.push({ username, password });
}

function generateSessionId() {
  return crypto.randomUUID().split('-')[4];
}

server.listen(port, () => {
  console.log(`Chat app listening at http://localhost:${port}`);
});
