import { updateTokenDisplay, decodeJWT, getUserToken, TokenService, API_URL } from "./tokenService.js";
import { safeJsonResponse } from './utils.js';

async function useAdminToken() {
  await TokenService.getFreshAdminToken();
  updateTokenDisplay();
}


function disconnect() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  document.getElementById('current-token').innerText = "Déconnecté";
  updateTokenDisplay();
  // "Reset Complet"
  location.reload();
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await safeJsonResponse(res);
      if (!data) return;

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        updateTokenDisplay();
        alert("Connexion réussie !");
      } else {
        alert("Erreur de connexion: " + (data.error || 'Inconnue'));
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la requête de connexion.");
    }
}

// si besoin d'une fonction manuelle pour switch admin sans appel API
function setAdminToken(token) {
  localStorage.setItem('token', token);
  document.getElementById('current-token').innerText = "Token Admin utilisé";
  updateTokenDisplay();
}

// MAJ manuelle du token (optionnel)
function updateToken(token) {
  localStorage.setItem('token', token);
  document.getElementById('current-token').innerText = "Token User actif";
  updateTokenDisplay();
}


function reconnect() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Aucun token stocké. Cliquez sur 'Utiliser Token Admin'");
    return;
  }
  updateTokenDisplay();
  alert("Session restaurée !");
}

async function signupUser() {
  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;

  try {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await safeJsonResponse(res);
    if (!data) return;

    if (data.token) {
      alert("Inscription réussie !");
      //localStorage.setItem('token', data.token);
      //localStorage.setItem('refreshToken', data.refreshToken);
    } else {
      alert("Erreur à l'inscription : " + (data.error || "Inconnue"));
    }
  } catch (e) {
    console.error(e);
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
  signupUser
};