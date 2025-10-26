const API_URL = "http://localhost:4000/api/v1";

const loginForm = document.getElementById("loginForm");
const tradingForm = document.getElementById("tradingForm");
const statusDiv = document.getElementById("status");

// Check if already logged in on popup open
chrome.storage.local.get(["token"], (result) => {
  if (result.token) {
    showTradingForm();
  }
});

// Login handler
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showStatus("Please enter email and password", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      await chrome.storage.local.set({ token: data.data.accessToken });
      showStatus("Login successful!", "success");
      showTradingForm();
    } else {
      const error = await response.json();
      showStatus(error.message || "Login failed", "error");
    }
  } catch (error) {
    showStatus("Error: " + error.message, "error");
  }
});

// Buy handler
document
  .getElementById("buyBtn")
  .addEventListener("click", () => executeTrade("buy"));

// Sell handler
document
  .getElementById("sellBtn")
  .addEventListener("click", () => executeTrade("sell"));

// Execute trade function
async function executeTrade(type) {
  const symbol = document.getElementById("symbol").value.trim().toUpperCase();
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!symbol) {
    showStatus("Please enter a stock symbol", "error");
    return;
  }

  if (!quantity || quantity < 1) {
    showStatus("Please enter valid quantity", "error");
    return;
  }

  try {
    const result = await chrome.storage.local.get(["token"]);

    const response = await fetch(`${API_URL}/assets/${symbol}/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${result.token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (response.ok) {
      showStatus(
        `${type.toUpperCase()} ${quantity} ${symbol} successful!`,
        "success"
      );
      document.getElementById("symbol").value = "";
      document.getElementById("quantity").value = "1";
    } else {
      const error = await response.json();
      showStatus(error.message || `${type} failed`, "error");
    }
  } catch (error) {
    showStatus("Error: " + error.message, "error");
  }
}

// Logout handler
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await chrome.storage.local.remove("token");
  showStatus("Logged out", "success");
  showLoginForm();
});

// UI helpers
function showLoginForm() {
  loginForm.classList.remove("hidden");
  tradingForm.classList.add("hidden");
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

function showTradingForm() {
  loginForm.classList.add("hidden");
  tradingForm.classList.remove("hidden");
}

function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = type;
  setTimeout(() => {
    statusDiv.textContent = "";
    statusDiv.className = "";
  }, 3000);
}
