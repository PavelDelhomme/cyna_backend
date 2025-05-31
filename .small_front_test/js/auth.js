import { TokenService, API_URL, apiPrefix } from "./tokenService.js";

async function useAdminToken() {
  TokenService.forcedAdmin = true;
  await TokenService.getFreshAdminToken();
}

function disconnect() {
  TokenService.clearTokens();
  localStorage.removeItem("forcedMode");
  TokenService.updateTokenDisplay();
  location.reload();
}

function forceAdmin() {
  TokenService.forcedAdmin = true;
  TokenService.forcedUser = false;
  localStorage.setItem("forcedMode", "admin");
  TokenService.updateTokenDisplay();
}

function forceUser() {
  TokenService.forcedUser = true;
  TokenService.forcedAdmin = false;
  localStorage.setItem("forcedMode", "user");
  TokenService.updateTokenDisplay();
}

async function login() {
  TokenService.forcedAdmin = false;
  TokenService.forcedUser = false;

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(
      `${API_URL}api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await TokenService.safeJsonResponse(res);
    if (!data) return;

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      TokenService.updateTokenDisplay();
      alert("Connexion réussie !");
    } else {
      alert("Erreur de connexion : " + (data.error || "Inconnue"));
    }
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la requête de connexion.");
  }
}

function setAdminToken(token) {
  localStorage.setItem("token", token);
  document.getElementById("current-token").innerText = "Token Admin utilisé";
  TokenService.updateTokenDisplay();
}

function updateToken(token) {
  localStorage.setItem("token", token);
  document.getElementById("current-token").innerText = "Token User actif";
  TokenService.updateTokenDisplay();
}

function reconnect() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Aucun token stocké. Cliquez sur 'Utiliser Token Admin'");
    return;
  }
  TokenService.updateTokenDisplay();
  alert("Session restaurée !");
}

async function signupUser() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const res = await fetch(
      `${API_URL}${apiPrefix()}/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      }
    );

    const data = await TokenService.safeJsonResponse(res);
    if (!data) return;

    if (data.token) {
      alert("Inscription réussie !");
    } else {
      alert("Erreur à l'inscription : " + (data.error || "Inconnue"));
    }
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'inscription.");
  }
}

export {
  useAdminToken,
  disconnect,
  login,
  updateToken,
  setAdminToken,
  reconnect,
  signupUser,
  forceAdmin,
  forceUser
};
