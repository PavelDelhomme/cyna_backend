import { API_URL, TokenService } from "./tokenService.js";


async function listReviews() {
    try {
      const res = await TokenService.authFetch(`${API_URL}/api/dev/reviews`);
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

async function createReview() {
  try {
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value;

    const res = await TokenService.authFetch(`${API_URL}/api/dev/reviews`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment })
    });

    const data = await TokenService.safeJsonResponse(res);
    if (!data) return;
    alert("Avis créé !");
    console.log(data);

    listReviews(); // Recharge les avis après création
  } catch (e) {
    console.error("Erreur création avis:", e);
    alert("Erreur création avis.");
  }
}


export { listReviews, createReview };