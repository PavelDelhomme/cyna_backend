// tokenService.js
export function getUserToken() {
  return localStorage.getItem('token');
}
export const API_URL = window.location.origin;

export const TokenService = {
  async initAdminSession() {
    const savedToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (savedToken && !TokenService.isExpired(savedToken)) {
      updateTokenDisplay();
      return;
    }

    if (refreshToken && !TokenService.isExpired(refreshToken)) {
      await TokenService.refreshToken(refreshToken);
      return;
    }

    await TokenService.getFreshAdminToken(); // fallback initial
  },

  async getFreshAdminToken() {
    try {
      const res = await fetch(`${API_URL}/api/auth/dev-admin`);
      const data = await res.json();
      console.log("[TokenService] getFreshAdminToken response:", data);

      if (!data.token || !data.refreshToken) throw new Error("Token manquant");

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      console.log("[TokenService] Token enregistré :", data.token);


      updateTokenDisplay();
      return data.token;
    } catch (err) {
      console.error("[TokenService] Erreur récupération admin token :", err);
      alert("Échec récupération token admin.");
      return null;
    }
  },

  async refreshToken(refreshToken) {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });

      const data = await res.json();
      if (!data.token || !data.refreshToken) throw new Error("Refresh échoué");

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      updateTokenDisplay();
    } catch (err) {
      console.error("Erreur lors du refresh token :", err);
      alert("Impossible de rafraîchir le token.");
      await TokenService.getFreshAdminToken(); // fallback ultime
    }
  },

  isExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (err) {
      return true;
    }
  }
};

export async function authFetch(url, options = {}) {
  let token = getUserToken();

  if (!token || TokenService.isExpired(token)) {
    console.warn("[authFetch] Token manquant ou expiré");

    const refresh = localStorage.getItem('refreshToken');
    if (refresh && !TokenService.isExpired(refresh)) {
      await TokenService.refreshToken(refresh);
    } else {
      const newToken = await TokenService.getFreshAdminToken();
      if (newToken) {
        token = newToken;
      }
    }

    token = getUserToken();
  }
  console.log("[authFetch] Token utilisé pour fetch:", token);

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Authorization" : `Bearer ${token}` 
    }
  });
}

export function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    return { error: 'Invalide ou illisible' };
  }
}

export function updateTokenDisplay() {
  const tokenDisplay = document.getElementById('current-token');
  const tokenDetails = document.getElementById('decoded-token');
  const roleBadge = document.getElementById('role-badge');
  const token = getUserToken();

  if (token) {
    const decoded = decodeJWT(token);
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    tokenDisplay.innerText = `Token actif (expire dans ${minutes}min ${seconds}s)`;
    tokenDetails.innerText = JSON.stringify(decoded, null, 2);

    if (roleBadge) {
      roleBadge.innerText = decoded.role || 'inconnu';
      roleBadge.className = 'badge-role ' + (decoded.role || 'unknown');
    }
  } else {
    tokenDisplay.innerText = "Token : Aucun";
    tokenDetails.innerText = "";
    if (roleBadge) {
      roleBadge.innerText = '';
      roleBadge.className = 'badge-role';
    }
  }
}
