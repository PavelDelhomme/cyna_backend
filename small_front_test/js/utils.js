import { API_URL, getUserToken } from "./tokenService.js";

async function safeJsonResponse(response) {
    const text = await response.text();
    console.log("[DEBUG] Réponse brute :", text);
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Réponse JSON invalide :", text);
      alert("Erreur côté serveur : réponse invalide.");
      return null;
    }
  }


async function fetchData(endpoint, resultElementId) {
    if (!getUserToken()) {
        alert("Merci de vous connecter ou d'utiliser le token admin.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${getUserToken()}`
            }
        });

        const data = await safeJsonResponse(response);
        if (!data) return;
        document.getElementById(resultElementId).innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error(error);
        alert("Erreur lors de la requête API.");
    }
}

export { safeJsonResponse, fetchData };