import { API_URL, authFetch } from "./tokenService.js";
import { safeJsonResponse } from './utils.js';



async function listPayments() {
    try {
      const response = await authFetch(`${API_URL}/api/dev/payments`);
      const data = await safeJsonResponse(response);
      if (!data) return;
      renderPaymentsTable(data);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des paiements.");
    }
}


function renderPaymentsTable(data) {
    const container = document.getElementById('payments-table');
    container.innerHTML = '';
    const table = document.createElement('table');
    table.className = "styled-table";
    table.innerHTML = `
      <thead><tr><th>ID</th><th>Montant</th><th>Méthode</th><th>Statut</th><th>Date</th></tr></thead>
      <tbody>
        ${data.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.amount} €</td>
            <td>${p.method}</td>
            <td>${p.status}</td>
            <td>${new Date(p.creationDate).toLocaleDateString()}</td>
          </tr>`).join('')}
      </tbody>`;
    container.appendChild(table);
}


async function createPayment() {
    const amount = parseFloat(document.getElementById('payment-amount').value);
    const method = document.getElementById('payment-method').value;
    const status = document.getElementById('payment-status').value;
  
    try {
      const res = await authFetch(`${API_URL}/api/dev/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method, status })
      });
      const data = await safeJsonResponse(res);
      if (data) alert("Paiement ajouté !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la création du paiement.");
    }
}

export { listPayments, createPayment };