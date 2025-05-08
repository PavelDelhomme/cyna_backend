import { API_URL, authFetch } from "./tokenService.js";
import { safeJsonResponse } from "./utils.js";

async function listProducts() {
  try {
    const response = await authFetch(`${API_URL}/api/dev/products`);
    const products = await safeJsonResponse(response);
    if (!products) return;
    renderProductsTable(products);
  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement des produits.");
  }
}
  
function renderProductsTable(products) {
  const container = document.getElementById('products-table');
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = "styled-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Description</th>
        <th>Prix</th>
        <th>Stock</th>
        <th>Promotion</th>
        <th>Catégorie</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${products.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.description}</td>
          <td>${p.price}€</td>
          <td>${p.stock}</td>
          <td>${p.promotion || ''}</td>
          <td>${p.category_id || 'N/A'}</td>
          <td><button onclick="deleteProduct(${p.id})">🗑️ Supprimer</button></td>
        </tr>
      `).join('')}
    </tbody>
  `;
  container.appendChild(table);
}


async function addProduct() {
  const categoryName = document.getElementById('product-category-name').value;

  let categoryId = null;

  try {
    const response = await authFetch(`${API_URL}/api/dev/product-categories`);
    const categories = await response.json();

    const existingCategory = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const createCatResponse = await authFetch(`${API_URL}/api/dev/product-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName,
          description: `Catégorie créée automatiquement: ${categoryName}`
        })
      });
      const newCategory = await createCatResponse.json();
      categoryId = newCategory.id;
    }

    const productData = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: parseFloat(document.getElementById('product-price').value),
      stock: parseInt(document.getElementById('product-stock').value),
      promotion: document.getElementById('product-promotion').value,
      category_id: categoryId
    };

    const productRes = await authFetch(`${API_URL}/api/dev/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    const result = await productRes.json();
    alert("Produit ajouté avec succès !");
    listProducts();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout du produit.");
  }
}


async function listProductCategories() {
  try {
    const response = await authFetch(`${API_URL}/api/dev/product-categories`);
    const categories = await response.json();
    renderProductCategoriesTable(categories);
  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement des catégories.");
  }
}


function renderProductCategoriesTable(categories) {
  const container = document.getElementById('product-categories-table');
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = "styled-table";

  table.innerHTML = `
    <thead>
      <tr><th>ID</th><th>Nom</th><th>Description</th></tr>
    </thead>
    <tbody>
      ${categories.map(cat => `
        <tr>
          <td>${cat.id}</td>
          <td>${cat.name}</td>
          <td>${cat.description || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  container.appendChild(table);
}


async function loadProductsIntoSelect(selectId) {
  const res = await authFetch(`${API_URL}/api/dev/products`);
  const products = await res.json();
  if (!Array.isArray(products)) {
    console.warn(`⚠️ products attendu comme tableau mais reçu :`, products);
    return;
  }
  const select = document.getElementById(selectId);
  select.innerHTML = products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}


async function loadProductCategoriesIntoSelect(selectId) {
  const res = await authFetch(`${API_URL}/api/dev/product-categories`);
  const categories = await res.json();
  if (!Array.isArray(categories)) {
    console.warn(`⚠️ categories attendu comme tableau mais reçu :`, categories);
    return;
  }
  const select = document.getElementById(selectId);
  select.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}


async function deleteProduct(id) {
  if (!confirm("Confirmer la suppression de ce produit ?")) return;

  try {
    const response = await authFetch(`${API_URL}/api/dev/products/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    alert(result.message || "Produit supprimé.");
    listProducts();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la suppression du produit.");
  }
}

export {
  listProducts,
  addProduct,
  listProductCategories,
  renderProductCategoriesTable,
  loadProductsIntoSelect,
  loadProductCategoriesIntoSelect,
  deleteProduct
};