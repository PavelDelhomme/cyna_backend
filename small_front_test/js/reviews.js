import { API_URL, authFetch } from "./tokenService.js";


async function listReviews() {
    try {
      const res = await authFetch(`${API_URL}/api/dev/reviews`);
      const data = await res.json();
  
      if (!Array.isArray(data)) {
        console.warn(`⚠️ reviews attendu comme tableau mais reçu :`, data);
        return;
      }
  
      renderReviewsTable(data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des avis.");
    }
}


function renderReviewsTable(data) {
    const container = document.getElementById('reviews-table');
    container.innerHTML = '';
    const table = document.createElement('table');
    table.className = "styled-table";
  
    table.innerHTML = `
      <thead>
        <tr><th>ID</th><th>Note</th><th>Description</th><th>Date</th></tr>
      </thead>
      <tbody>
        ${data.map(r => `
          <tr>
            <td>${r.id}</td>
            <td>${r.rating}</td>
            <td>${r.description}</td>
            <td>${r.reviewDate}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  
    container.appendChild(table);
}

export { listReviews };