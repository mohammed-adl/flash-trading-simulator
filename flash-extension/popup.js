const API_URL =
  "https://flash-trading-simulator-production.up.railway.app/api/v1";

const loginForm = document.getElementById("loginForm");
const tradingForm = document.getElementById("tradingForm");
const statusDiv = document.getElementById("status");

chrome.storage.local.get(["token"], (result) => {
  if (result.token) showTradingForm();
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || !password)
    return showStatus("Please enter email and password", "error");

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      await chrome.storage.local.set({
        token: data.token,
        refreshToken: data.refreshToken,
      });
      showStatus("Login successful!", "success");
      showTradingForm();
    } else {
      const err = await res.json();
      showStatus(err.message || "Login failed", "error");
    }
  } catch (e) {
    showStatus("Error: " + e.message, "error");
  }
});

document
  .getElementById("buyBtn")
  .addEventListener("click", () => executeTrade("buy"));
document
  .getElementById("sellBtn")
  .addEventListener("click", () => executeTrade("sell"));

async function authFetch(url, options = {}) {
  const { token } = await chrome.storage.local.get(["token"]);
  options.headers = options.headers || {};
  options.headers.Authorization = `Bearer ${token}`;

  let res = await fetch(url, options);
  if (res.status === 401) {
    const { refreshToken } = await chrome.storage.local.get(["refreshToken"]);
    if (!refreshToken) {
      showLoginForm();
      throw new Error("No refresh token");
    }
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      await chrome.storage.local.set({ token: data.accessToken });
      options.headers.Authorization = `Bearer ${data.accessToken}`;
      res = await fetch(url, options);
    } else {
      await chrome.storage.local.remove(["token", "refreshToken"]);
      showLoginForm();
      showStatus("Session expired, please login again", "error");
      throw new Error("Refresh failed");
    }
  }
  return res;
}

async function executeTrade(type) {
  const symbol = document.getElementById("symbol").value.trim().toUpperCase();
  const quantity = parseInt(document.getElementById("quantity").value);
  if (!symbol) return showStatus("Please enter a stock symbol", "error");
  if (!quantity || quantity < 1)
    return showStatus("Please enter valid quantity", "error");

  try {
    const res = await authFetch(`${API_URL}/assets/${symbol}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      showStatus(
        `${type.toUpperCase()} ${quantity} ${symbol} successful!`,
        "success"
      );
      document.getElementById("symbol").value = "";
      document.getElementById("quantity").value = "1";
    } else {
      const err = await res.json();
      showStatus(err.message || `${type} failed`, "error");
    }
  } catch (e) {}
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await chrome.storage.local.remove(["token", "refreshToken"]);
  showStatus("Logged out", "success");
  showLoginForm();
});

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
