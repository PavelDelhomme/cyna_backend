import { API_URL, TokenService, apiPrefix } from "./tokenService.js";

async function listCarts() {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/carts`
    );
    const data = await TokenService.safeJsonResponse(res);
    if (!Array.isArray(data)) {
      console.warn(`⚠️ carts attendu comme tableau mais reçu :`, data);
      return;
    }
    renderCartsTable(data);
  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement des paniers.");
  }
}

function renderCartsTable(data) {
  const container = document.getElementById('carts-table');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = "styled-table";
  table.innerHTML = `
    <thead>
      <tr><th>ID</th><th>Créé</th><th>MAJ</th></tr>
    </thead>
    <tbody>
      ${data.map(c => `
        <tr>
          <td>${c.id}</td>
          <td>${new Date(c.creationDate).toLocaleDateString()}</td>
          <td>${new Date(c.lastUpdate).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  container.appendChild(table);
}

async function createCart() {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/carts`,
      { method: 'POST' }
    );
    const data = await TokenService.safeJsonResponse(res);
    if (data) {
      alert("Panier créé !");
      listCarts();
    }
  } catch (e) {
    console.error(e);
    alert("Erreur création panier.");
  }
}

async function createCartForUser() {
  const userId = document.getElementById('cart-user-id').value;
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/carts/user/${userId}`,
      { method: 'POST' }
    );
    const data = await TokenService.safeJsonResponse(res);
    if (data) {
      alert("Panier créé pour l'utilisateur !");
      listCarts();
    }
  } catch (e) {
    console.error(e);
    alert("Erreur création panier pour l'utilisateur.");
  }
}

async function addProductToCart() {
  const cartId = document.getElementById('cart-id-product').value;
  const productId = document.getElementById('product-id-to-add').value;

  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/carts/${cartId}/product/${productId}`,
      { method: 'POST' }
    );
    const data = await TokenService.safeJsonResponse(res);
    if (data) {
      alert("Produit ajouté au panier !");
      listCarts();
    }
  } catch (e) {
    console.error(e);
    alert("Erreur ajout produit au panier.");
  }
}

async function addServiceToCart() {
  const cartId = document.getElementById('cart-id-service').value;
  const serviceId = document.getElementById('service-id-to-add').value;

  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/carts/${cartId}/service/${serviceId}`,
      { method: 'POST' }
    );
    const data = await TokenService.safeJsonResponse(res);
    if (data) {
      alert("Service ajouté au panier !");
      listCarts();
    }
  } catch (e) {
    console.error(e);
    alert("Erreur ajout service au panier.");
  }
}

async function loadCartsIntoSelect(selectId) {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/carts`
    );
    const carts = await TokenService.safeJsonResponse(res);
    if (!Array.isArray(carts)) {
      console.warn(`⚠️ carts attendu comme tableau mais reçu :`, carts);
      return;
    }
    const select = document.getElementById(selectId);
    select.innerHTML = carts
      .map(c => `<option value="${c.id}">Panier #${c.id}</option>`)
      .join('');
  } catch (e) {
    console.error(e);
    alert("Erreur lors du chargement des paniers.");
  }
}

export {
  listCarts,
  renderCartsTable,
  createCart,
  createCartForUser,
  addProductToCart,
  addServiceToCart,
  loadCartsIntoSelect
};
