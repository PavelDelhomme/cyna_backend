import { API_URL, TokenService } from "./tokenService.js";


async function listOrders() {
    try {
      const res = await TokenService.authFetch(`${API_URL}/api/dev/orders`);
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
      <thead><tr><th>ID</th><th>Prix</th><th>Statut</th><th>Créé</th></tr></thead>
      <tbody>
      ${data.map(o => `<tr><td>${o.id}</td><td>${o.totalPrice}</td><td>${o.status}</td><td>${o.created_at}</td></tr>`).join('')}
      </tbody>`;
    container.appendChild(table);
  }
  
  
  
async function addOrder() {
    const order = {
      subject: document.getElementById('order-subject').value,
      description: document.getElementById('order-description').value
    };
  
    try {
      const res = await TokenService.authFetch(`${API_URL}/api/dev/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
  
      const text = await res.text();
      console.log(text);
  
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        alert("Erreur inattendue lors de la création de la commande.");
        return;
      }
  
      alert("Commande ajoutée !");
      listOrders();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la requête de création.");
    }
  }

export { listOrders, addOrder };