import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat-container");

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let idx = 0;
  let interval = setInterval(() => {
    if (idx < text.length) {
      element.textContent += text.chartAt(idx);
      id++;
    } else {
      clearInterval(interval);
    }
  });
}

function generateUniqueID() {
  const timeStamp = Date.now();
  const randomNum = Math.random();
  const hexadecimalString = randomNum.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
  <div class="wrapper ${isAi && "ai"}">
    <div class="chat">
      <div class="profile">
        <img src=${isAi ? bot : user} alt=${isAi ? "bot" : "user"} />
      </div>
      <div class='message' id=${uniqueId} >${value}</div>
    </div>
  </div>
  
  `;
}

async function handleSubmit(e) {
  e.preventDefault();
  const data = new FormData(form);
  // user chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();

  // bot chat stripe
  const uniqueId = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // bots response fetch request
  const response = await fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  console.log("line 84", response);
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  console.log("hello");
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
