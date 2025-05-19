import { API_URL, TokenService, apiPrefix } from "./tokenService.js";

async function listOrders() {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/orders`
    );
    const data = await res.json();
    renderOrdersTable(data);
  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement des commandes.");
  }
}

function renderOrdersTable(data) {
  const container = document.getElementById('orders-table');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = "styled-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Prix</th>
        <th>Statut</th>
        <th>Créé</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(o => `
        <tr>
          <td>${o.id}</td>
          <td>${o.totalPrice}</td>
          <td>${o.status}</td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  container.appendChild(table);
}

async function addOrder() {
  // Adaptez ici la structure 'order' aux champs réels attendus par votre API
  const order = {
    subject: document.getElementById('order-subject').value,
    description: document.getElementById('order-description').value
  };

  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/orders`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      }
    );

    const text = await res.text();
    console.log('[DEBUG] Création commande réponse :', text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      alert("Erreur inattendue lors de la création de la commande.");
      return;
    }

    alert("Commande ajoutée !");
    listOrders();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la requête de création de commande.");
  }
}

export { listOrders, addOrder };
