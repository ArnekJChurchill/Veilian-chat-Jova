require("dotenv").config();
const express = require("express");
const Pusher = require("pusher");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// Simple in-memory storage (replace with DB later)
let users = {}; // { username: { password, avatar, bio, joinDate } }
let messages = []; // { username, content, timestamp }

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ msg: "Username exists" });
  users[username] = { password, avatar: "", bio: "", joinDate: new Date() };
  return res.json({ msg: "Signup successful" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username].password !== password)
    return res.status(400).json({ msg: "Invalid credentials" });
  return res.json({ msg: "Login successful", user: users[username] });
});

app.post("/message", (req, res) => {
  const { username, content } = req.body;
  const message = { username, content, timestamp: new Date() };
  messages.push(message);

  pusher.trigger("main-chat", "new-message", message);
  return res.json({ msg: "Message sent" });
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

