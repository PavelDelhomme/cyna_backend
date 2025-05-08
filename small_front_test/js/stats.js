import { API_URL, authFetch } from "./tokenService.js";

async function listStats() {
    try {
      const res = await authFetch(`${API_URL}/api/dev/stats`);
      const data = await res.json();
  
      if (!Array.isArray(data)) {
        console.warn(`⚠️ stats attendu comme tableau mais reçu :`, data);
        return;
      }
  
      renderStatsTable(data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des statistiques.");
    }
}


function renderStatsTable(data) {
    const container = document.getElementById('stats-table');
    container.innerHTML = '';
  
    const table = document.createElement('table');
    table.className = "styled-table";
  
    table.innerHTML = `
      <thead>
        <tr><th>ID</th><th>User Profile</th></tr>
      </thead>
      <tbody>
        ${data.map(s => `
          <tr>
            <td>${s.id}</td>
            <td>${s.user_profile_id}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  
    container.appendChild(table);
}


export { listStats };