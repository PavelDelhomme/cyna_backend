import { API_URL, TokenService, apiPrefix } from "./tokenService.js";

async function listPayments() {
    try {
        const response = await TokenService.authFetch(
            `${API_URL}${apiPrefix()}/payments`
        );
        const data = await TokenService.safeJsonResponse(response);
        if (!Array.isArray(data)) {
            console.warn(`⚠️ paiements attendu comme tableau mais reçu :`, data);
            return;
        }
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
      <thead>
        <tr>
          <th>ID</th><th>Montant</th><th>Méthode</th><th>Statut</th><th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.amount} €</td>
            <td>${p.method}</td>
            <td>${p.status}</td>
            <td>${new Date(p.creationDate).toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    container.appendChild(table);
}

async function createPayment() {
    const amount = parseFloat(document.getElementById('payment-amount').value);
    const method = document.getElementById('payment-method').value;
    const status = document.getElementById('payment-status').value;

    try {
        const res = await TokenService.authFetch(
            `${API_URL}${apiPrefix()}/payments`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, method, status })
            }
        );
        const data = await TokenService.safeJsonResponse(res);
        if (data) {
            alert("Paiement ajouté !");
            listPayments();
        }
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la création du paiement.");
    }
}

export { listPayments, createPayment };
