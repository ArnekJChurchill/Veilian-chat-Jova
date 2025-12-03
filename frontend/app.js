const loginPage = document.getElementById("loginPage");
const chatPage = document.getElementById("chatPage");
const loginMsg = document.getElementById("loginMsg");
const chatBox = document.getElementById("chatBox");
const userInfo = document.getElementById("userInfo");

let currentUser = "";

const apiURL = "https://YOUR_RENDER_BACKEND_URL"; // replace with Render backend

// Signup
document.getElementById("signupBtn").onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch(apiURL + "/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  loginMsg.innerText = data.msg;
};

// Login
document.getElementById("loginBtn").onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch(apiURL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (res.status === 200) {
    currentUser = username;
    userInfo.innerText = "Logged in as: " + username;
    loginPage.style.display = "none";
    chatPage.style.display = "block";
    loadMessages();
  } else loginMsg.innerText = data.msg;
};

// Load existing messages
async function loadMessages() {
  const res = await fetch(apiURL + "/messages");
  const msgs = await res.json();
  chatBox.innerHTML = "";
  msgs.forEach(m => chatBox.innerHTML += `<div><b>${m.username}</b>: ${m.content}</div>`);
}

// Send message
document.getElementById("sendBtn").onclick = async () => {
  const content = document.getElementById("messageInput").value;
  if (!content) return;
  await fetch(apiURL + "/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser, content }),
  });
  document.getElementById("messageInput").value = "";
};

// Pusher realtime
const pusher = new Pusher("b7d05dcc13df522efbbc", { cluster: "us2" });
const channel = pusher.subscribe("main-chat");
channel.bind("new-message", function(data) {
  chatBox.innerHTML += `<div><b>${data.username}</b>: ${data.content}</div>`;
});

