export const API_URL = "http://localhost:3007";

export const TokenService = {
  forcedAdmin: false,

  getUserToken() {
    return localStorage.getItem('token');
  },

  isExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (err) {
      return true;
    }
  },

  async initAdminSession() {
    // Appliquer le mode forcé sauvegardé (si existe)
    const mode = localStorage.getItem("forcedMode");
    if (mode === "admin") {
        this.forcedAdmin = true;
        this.forcedUser = false;
    } else if (mode === "user") {
        this.forcedUser = true;
        this.forcedAdmin = false;
    } else {
        this.forcedAdmin = false;
        this.forcedUser = false;
    }

    const token = localStorage.getItem('token');
    if (token && !this.isExpired(token)) {
        console.log("[initAdminSession] Session existante détectée.");
    } else {
        console.log("[initAdminSession] Aucun token valide, mode neutre.");
    }
    this.updateTokenDisplay();
  },

  async getFreshAdminToken() {
    try {
      const res = await fetch(`${API_URL}/api/admin/auth/generate-admin-token`);
      const data = await res.json();
      console.log("[TokenService] getFreshAdminToken response:", data);

      if (!data.token || !data.refreshToken) throw new Error("Token manquant");

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      console.log("[TokenService] Token enregistré :", data.token);

      this.updateTokenDisplay();
      return data.token;
    } catch (err) {
      console.error("[TokenService] Erreur récupération admin token :", err);
      alert("Échec récupération token admin : " + (err?.message || 'Inconnue'));
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
      this.updateTokenDisplay();
    } catch (err) {
      console.error("Erreur lors du refresh token :", err);
      alert("Impossible de rafraîchir le token.");
      await this.getFreshAdminToken();
    }
  },

  async validateAndAutoFixSession() {
    try {
      const res = await this.authFetch(`${API_URL}/api/dev/admin-only`);
      const data = await res.json();
      console.log("[Session Check] OK:", data);
    } catch (err) {
      console.warn("[Session Check] Erreur de token, tentative de reset...");
      await this.getFreshAdminToken();
    }
  },

  async authFetch(url, options = {}) {
    let token = this.getUserToken();

    if (this.forcedAdmin) {
      console.warn("[authFetch] Mode forcé admin activé");
      token = await this.getFreshAdminToken();
    } else if (!token || this.isExpired(token)) {
      console.warn("[authFetch] Token manquant ou expiré, récupération...");

      const refresh = localStorage.getItem('refreshToken');
      if (refresh && !this.isExpired(refresh)) {
        await this.refreshToken(refresh);
      } else {
        token = await this.getFreshAdminToken();
      }
    }

    if (this.forcedUser) {
      console.warn("[authFetch] Mode forcé utilisateur activé");
    }

    //console.log("[authFetch] Token utilisé pour fetch:", token);

    // Auto refresh si besoin
    if (!token || this.isExpired(token)) {
      console.warn("[authFetch] Token expiré ou manquant");
      const refresh = localStorage.getItem("refreshToken");
      if (refresh && !this.isExpired(refresh)) {
        await this.refreshToken(refresh);
        token = this.getUserToken();
      } else {
        token = await this.getFreshAdminToken();
      }
    }

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}` 
      }
    });
  },


  async safeJsonResponse(response) {
    const text = await response.text();
    console.log("[DEBUG] Réponse brute :", text);
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Réponse JSON invalide :", text);
      alert("Erreur côté serveur : réponse invalide.");
      return null;
    }
  },

  
  async fetchData(endpoint, resultElementId) {
    try {
      const response = await this.authFetch(`${API_URL}${endpoint}`);
      const data = await this.safeJsonResponse(response);
      if (!data) return;
      document.getElementById(resultElementId).innerText = JSON.stringify(data, null, 2);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la requête API.");
    }
  },

  decodeJWT(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (err) {
      return { error: 'Invalide ou illisible' };
    }
  },

  updateTokenDisplay() {
    const tokenDisplay = document.getElementById('current-token');
    const tokenDetails = document.getElementById('decoded-token');
    const roleBadge = document.getElementById('role-badge');
    const token = this.getUserToken();

    if (token) {
      const decoded = this.decodeJWT(token);
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

    const tokenStatus = document.getElementById('token-status');
    if (tokenStatus) {
      if (this.forcedAdmin) {
        tokenStatus.innerText = "🔒 Mode Admin Forcé";
      } else if (this.forcedUser) {
        tokenStatus.innerText = "👤 Mode Utilisateur Forcé";
      } else {
        // Lecture propre du token réel
        const token = this.getUserToken();
        if (token) {
          const decoded = this.decodeJWT(token);
          tokenStatus.innerText = `Mode : ${decoded.role || 'inconnu'}`;
        } else {
          tokenStatus.innerText = "Mode : Aucun";
        }
      }
    }
  },

  
  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.forcedAdmin = false;
  },

  forceResetAndFetchAdminToken() {
    this.clearTokens();
    this.forcedAdmin = true;
    return this.getFreshAdminToken();
  },

  disconnect() {
    this.clearTokens();
    localStorage.removeItem("forceMode");
    this.updateTokenDisplay();
    location.reload();
  }

};

export function apiPrefix() {
  return TokenService.forcedAdmin
    ? '/api/admin'
    : '/api';
}