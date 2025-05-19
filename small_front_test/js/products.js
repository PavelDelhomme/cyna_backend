import { API_URL, TokenService, apiPrefix } from "./tokenService.js";

async function listProducts() {
  try {
    const response = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/products`
    );
    const products = await TokenService.safeJsonResponse(response);
    if (!Array.isArray(products)) {
      console.warn(`⚠️ products attendu comme tableau mais reçu :`, products);
      return;
    }
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
        <th>ID</th><th>Nom</th><th>Description</th><th>Prix</th>
        <th>Stock</th><th>Promotion</th><th>Catégorie</th><th>Actions</th>
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
    // Récupérer ou créer la catégorie
    const resCats = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/product-categories`
    );
    const categories = await resCats.json();
    const existing = categories.find(c =>
      c.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (existing) {
      categoryId = existing.id;
    } else {
      const createCat = await TokenService.authFetch(
        `${API_URL}${apiPrefix()}/product-categories`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: categoryName,
            description: `Catégorie créée automatiquement : ${categoryName}`
          })
        }
      );
      const newCat = await createCat.json();
      categoryId = newCat.id;
    }

    // Créer le produit
    const productData = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: parseFloat(document.getElementById('product-price').value),
      stock: parseInt(document.getElementById('product-stock').value),
      promotion: document.getElementById('product-promotion').value,
      category_id: categoryId
    };

    const resProd = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/products`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      }
    );
    await resProd.json();
    alert("Produit ajouté avec succès !");
    listProducts();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout du produit.");
  }
}

async function listProductCategories() {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/product-categories`
    );
    const categories = await res.json();
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
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/products`
    );
    const products = await res.json();
    if (!Array.isArray(products)) {
      console.warn(`⚠️ products attendu comme tableau mais reçu :`, products);
      return;
    }
    const select = document.getElementById(selectId);
    select.innerHTML = products
      .map(p => `<option value="${p.id}">${p.name}</option>`)
      .join('');
  } catch (e) {
    console.error(e);
    alert("Erreur chargement produits pour select.");
  }
}

async function loadProductCategoriesIntoSelect(selectId) {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/product-categories`
    );
    const cats = await res.json();
    if (!Array.isArray(cats)) {
      console.warn(`⚠️ categories attendu comme tableau mais reçu :`, cats);
      return;
    }
    const select = document.getElementById(selectId);
    select.innerHTML = cats
      .map(c => `<option value="${c.id}">${c.name}</option>`)
      .join('');
  } catch (e) {
    console.error(e);
    alert("Erreur chargement catégories pour select.");
  }
}

async function deleteProduct(id) {
  if (!confirm("Confirmer la suppression de ce produit ?")) return;
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/products/${id}`,
      { method: 'DELETE' }
    );
    const result = await res.json();
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
