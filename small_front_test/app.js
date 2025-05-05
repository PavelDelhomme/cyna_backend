
let userToken = localStorage.getItem('token') || null;
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NTc1NDEwNSwiZXhwIjoxNzc3MjkwMTA1fQ.QNfkzJmfAl1sXic4uXlJ5pcHpybY_gQ2snILAFZs0EM";

const API_URL = window.location.origin;


let currentPage = 1;
const pageSize = 20;



// On branche le submit du form login automatiquement
document.addEventListener('DOMContentLoaded', () => {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    userToken = savedToken;
    updateTokenDisplay();
  }

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await login();
  });

  document.getElementById('address-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addAddress();
  });

  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addProduct();
  });
  
  document.getElementById('service-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addService();
  });
  
  // Charge les utilisateurs au chargement de page si admin
  listUsers();
});

async function safeJsonResponse(response) {
  const text = await response.text();
  console.log("[DEBUG] Réponse brute :", text);
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Réponse JSON invalide :", text);
    alert("Erreur côté serveur : réponse invalide.");
    return null;
  }
}


async function listUserTokens() {
  const res = await fetch(`${API_URL}/api/dev/tokens`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  const data = await res.json();
  document.getElementById('result').innerText = JSON.stringify(data, null, 2);
}

function useAdminToken() {
    userToken = ADMIN_TOKEN;
    localStorage.setItem('token', ADMIN_TOKEN);
    document.getElementById('current-token').innerText = "Token Admin utilisé";
    updateTokenDisplay();
}
  
function disconnect() {
    userToken = null;
    localStorage.removeItem('token');
    document.getElementById('current-token').innerText = "Déconnecté";
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await safeJsonResponse(response);
      if (!data) return;
      if (response.ok) {
        userToken = data.token;
        localStorage.setItem('token', data.token);
        document.getElementById('current-token').innerText = "Token User actif";
        alert("Connexion réussie !");
      } else {
        alert("Erreur de connexion: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la requête de connexion.");
    }
    updateTokenDisplay();
}

async function listUsers(page = 1) {
    if (!userToken) {
      alert("Merci de vous connecter ou utiliser le token admin.");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/api/dev/users`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
  
      const users = await response.json();
  
      const start = (page - 1) * pageSize;
      const paginatedUsers = users.slice(start, start + pageSize);
  
      renderUsersTable(paginatedUsers);
      renderPagination(users.length, page);
  
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des utilisateurs.");
    }
}


function renderUsersTable(users) {
    const container = document.getElementById('users-table');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = "styled-table";

    table.innerHTML = `
        <thead>
        <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Créé le</th>
        </tr>
        </thead>
        <tbody>
        ${users.map(user => `
            <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role ? user.role.name : 'N/A'}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('')}
        </tbody>
    `;

    container.appendChild(table);
}

async function assignRoleToUser() {
  const userId = document.getElementById('role-user-id').value;
  const roleId = document.getElementById('role-id').value;

  try {
    const res = await fetch(`${API_URL}/api/dev/assignRole/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roleId })
    });

    const data = await safeJsonResponse(res);
    if (data) alert("Rôle assigné avec succès !");
  } catch (e) {
    console.error(e);
    alert("Erreur lors de l’assignation du rôle.");
  }
}

async function assignPromoToProduct() {
  const promoId = document.getElementById('promo-id').value;
  const productId = document.getElementById('product-id').value;

  try {
    const res = await fetch(`${API_URL}/api/dev/promo-codes/${promoId}/product/${productId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const data = await safeJsonResponse(res);
    if (data) alert("Promo appliquée au produit !");
  } catch (e) {
    console.error(e);
    alert("Erreur lors de l’application de la promo.");
  }
}


function renderPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
  
    if (totalPages <= 1) return;
  
    if (currentPage > 1) {
      const prev = document.createElement('button');
      prev.innerText = "⬅️ Précédent";
      prev.onclick = () => listUsers(currentPage - 1);
      pagination.appendChild(prev);
    }
  
    pagination.appendChild(document.createTextNode(` Page ${currentPage} / ${totalPages} `));
  
    if (currentPage < totalPages) {
      const next = document.createElement('button');
      next.innerText = "Suivant ➡️";
      next.onclick = () => listUsers(currentPage + 1);
      pagination.appendChild(next);
    }
}
  


async function getMyAddresses() {
    await fetchData('/api/addresses/me', 'addresses-list');
}

async function fetchData(endpoint, resultElementId) {
    if (!userToken) {
        alert("Merci de vous connecter ou d'utiliser le token admin.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        const data = await safeJsonResponse(response);
        if (!data) return;
        document.getElementById(resultElementId).innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error(error);
        alert("Erreur lors de la requête API.");
    }
}


function setAdminToken() {
  userToken = ADMIN_TOKEN;
  document.getElementById('current-token').innerText = "Token Admin utilisé";
}

function updateToken(token) {
  userToken = token;
  document.getElementById('current-token').innerText = "Token User actif";
}

async function fetchData(endpoint) {
  if (!userToken) {
    alert("Merci de vous connecter ou utiliser le token admin.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    const data = await safeJsonResponse(response);
    if (!data) return;
    document.getElementById('result').innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la requête API.");
  }
}

async function addAddress() {
  if (!userToken) {
    alert("Merci de vous connecter ou utiliser le token admin.");
    return;
  }

  const userId = document.getElementById('user-id-address').value;

  const addressData = {
    address1: document.getElementById('address1').value,
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode').value,
    region: document.getElementById('region').value,
    country: document.getElementById('country').value,
    type: document.getElementById('type').value
  };

  try {
    const response = await fetch(`${API_URL}/api/dev/addresses/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(addressData)
    });

    const data = await safeJsonResponse(response);
    if (!data) return;
    document.getElementById('result').innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout de l'adresse.");
  }
  
}


function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    return { error: 'Invalide ou illisible' };
  }
}

function updateTokenDisplay() {
  const tokenDisplay = document.getElementById('current-token');
  const tokenDetails = document.getElementById('decoded-token');

  if (userToken) {
    tokenDisplay.innerText = "Token actif";
    tokenDetails.innerText = JSON.stringify(decodeJWT(userToken), null, 2);
  } else {
    tokenDisplay.innerText = "Token : Aucun";
    tokenDetails.innerText = "";
  }
}



async function listProducts() {
  if (!userToken) {
    alert("Merci de vous connecter ou d'utiliser le token admin.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/dev/products`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    const products = await response.json();
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
  if (!userToken) {
    alert("Merci de vous connecter ou utiliser le token admin.");
    return;
  }

  const categoryName = document.getElementById('product-category-name').value;

  let categoryId = null;

  try {
    // Vérifie si la catégorie existe déjà
    const response = await fetch(`${API_URL}/api/dev/product-categories`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    const categories = await response.json();

    const existingCategory = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      // Crée la catégorie si elle n'existe pas
      const createCatResponse = await fetch(`${API_URL}/api/dev/product-categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: categoryName,
          description: `Catégorie créée automatiquement: ${categoryName}`
        })
      });

      const newCategory = await createCatResponse.json();
      categoryId = newCategory.id;
    }

    // Maintenant créer le produit avec la catégorie récupérée ou créée
    const productData = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: parseFloat(document.getElementById('product-price').value),
      stock: parseInt(document.getElementById('product-stock').value),
      promotion: document.getElementById('product-promotion').value,
      category_id: categoryId
    };

    const productRes = await fetch(`${API_URL}/api/dev/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    const result = await productRes.json();
    alert("Produit ajouté avec succès !");
    listProducts(); // recharge la table
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout du produit.");
  }
}

async function listProductCategories() {
  if (!userToken) {
    alert("Merci de vous connecter ou utiliser le token admin.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/dev/product-categories`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

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
      <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Description</th>
      </tr>
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


async function listServices() {
  if (!userToken) {
    alert("Merci de vous connecter ou d'utiliser le token admin.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/dev/services`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const services = await response.json();
    renderServicesTable(services);
  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement des services.");
  }
}


function renderServicesTable(services) {
  const container = document.getElementById('services-table');
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
        <th>Statut</th>
        <th>Abonnement</th>
        <th>Type</th>
        <th>Utilisateurs</th>
        <th>Promotion</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${services.map(s => `
        <tr>
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.description}</td>
          <td>${s.price}€</td>
          <td>${s.status ? '✅' : '❌'}</td>
          <td>${s.subscription ? 'Oui' : 'Non'}</td>
          <td>${s.subscriptionType || '-'}</td>
          <td>${s.userCount || 0}</td>
          <td>${s.promotion || '-'}</td>
          <td><button onclick="deleteService(${s.id})">🗑️ Supprimer</button></td>
        </tr>
      `).join('')}
    </tbody>
  `;

  container.appendChild(table);
}


async function addService() {
  if (!userToken) {
    alert("Merci de vous connecter ou utiliser le token admin.");
    return;
  }

  const typeName = document.getElementById('service-subscriptionType').value;

  let serviceTypeId = null;

  try {
    // Vérifie si le type existe
    const response = await fetch(`${API_URL}/api/dev/service-types`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    const types = await response.json();

    const existingType = types.find(t => t.name.toLowerCase() === typeName.toLowerCase());
    if (existingType) {
      serviceTypeId = existingType.id;
    } else {
      // Crée le type de service
      const createResponse = await fetch(`${API_URL}/api/dev/service-types`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: typeName,
          description: `Type auto : ${typeName}`
        })
      });

      const newType = await createResponse.json();
      serviceTypeId = newType.id;
    }

    // Crée le service
    const serviceData = {
      name: document.getElementById('service-name').value,
      description: document.getElementById('service-description').value,
      price: parseFloat(document.getElementById('service-price').value),
      status: document.getElementById('service-status').value === 'true',
      subscription: document.getElementById('service-subscription').value === 'true',
      subscriptionType: typeName,
      userCount: parseInt(document.getElementById('service-userCount').value),
      promotion: document.getElementById('service-promotion').value,
      service_type_id: serviceTypeId
    };

    const responseService = await fetch(`${API_URL}/api/dev/services`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });

    const result = await responseService.json();
    alert("Service ajouté !");
    listServices();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout du service.");
  }
}

async function listServiceTypes() {
  if (!userToken) {
    alert("Merci de vous connecter ou d'utiliser le token admin.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/dev/service-types`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const types = await response.json();
    renderServiceTypesTable(types);
  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement des types de services.");
  }
}

function renderServiceTypesTable(types) {
  const container = document.getElementById('service-types-table');
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = "styled-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Description</th>
        <th>Créé le</th>
      </tr>
    </thead>
    <tbody>
      ${types.map(t => `
        <tr>
          <td>${t.id}</td>
          <td>${t.name}</td>
          <td>${t.description || '-'}</td>
          <td>${new Date(t.created_at).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  container.appendChild(table);
}

async function listPayments() {
  if (!userToken) {
    alert("Merci de vous connecter ou d'utiliser le token admin.");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/api/dev/payments`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const data = await safeJsonResponse(response);
    if (!data) return;
    renderPaymentsTable(data);
  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement de paiements.");
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



async function listTickets() {
  if (!userToken) return alert("Connectez-vous d'abord.");
  try {
    const res = await fetch(`${API_URL}/api/dev/tickets`, { headers: { Authorization: `Bearer ${userToken}` }});
    // const data = await res.json();
    const text =  await res.text();
    console.log('[DEBUG] Réponse brute : ', text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("La réponse n'était pas du JSON valide :", text);
      alert("Erreur côté serveur : réponse invalide");
      return;
    }
    
    renderTicketsTable(data);
  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement des tickets.");
  }
}
function renderTicketsTable(data) {
  const container = document.getElementById('tickets-table');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = "styled-table";
  table.innerHTML = `
    <thead><tr><th>ID</th><th>Objet</th><th>Description</th><th>Statut</th><th>Date</th></tr></thead>
    <tbody>
    ${data.map(t => `<tr><td>${t.id}</td><td>${t.subject}</td><td>${t.description}</td><td>${t.status}</td><td>${t.creationDate}</td></tr>`).join('')}
    </tbody>`;
  container.appendChild(table);
}


async function addTicket() {
  const ticket = {
    subject: document.getElementById('ticket-subject').value,
    description: document.getElementById('ticket-description').value
  };

  const response = await fetch(`${API_URL}/api/dev/tickets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticket)
  });

  const text = await response.text();
  console.log(text);
  let result;
  try {
    result = JSON.parse(text);
  } catch (e) {
    alert("Erreur inattendue lors de la création du ticket.");
    return;
  }

  alert("Ticket ajouté !");
  listTickets();
}

async function addOrder() {
  const order = {
    subject: document.getElementById('order-subject').value,
    description: document.getElementById('order-description').value
  };

  const response = await fetch(`${API_URL}/api/dev/orders`, {  // <-- bonne route ?
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)  // <-- PAS `ticket`
  });
  
  const text = await response.text();
  console.log(text);
  let result;
  try {
    result = JSON.parse(text);
  } catch (e) {
    alert("Erreur inattendue lors de la création de la commande.");
    return;
  }  
}


async function listOrders() {
  if (!userToken) return alert("Connectez-vous d'abord.");
  try {
    const res = await fetch(`${API_URL}/api/dev/orders`, { headers: { Authorization: `Bearer ${userToken}` }});
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

async function listCarts() {
  if (!userToken) return alert("Connectez-vous d'abord.");
  try {
    const res = await fetch(`${API_URL}/api/dev/carts`, { headers: { Authorization: `Bearer ${userToken}` }});
    const data = await res.json();
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
    <thead><tr><th>ID</th><th>Créé</th><th>MAJ</th></tr></thead>
    <tbody>
    ${data.map(c => `<tr><td>${c.id}</td><td>${c.creationDate}</td><td>${c.lastUpdate}</td></tr>`).join('')}
    </tbody>`;
  container.appendChild(table);
}

async function listPromocodes() {
  if (!userToken) return alert("Connectez-vous d'abord.");
  try {
    const res = await fetch(`${API_URL}/api/dev/promo-codes`, { headers: { Authorization: `Bearer ${userToken}` }});
    const data = await res.json();
    renderPromocodesTable(data);
  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement des codes promo.");
  }
}
function renderPromocodesTable(data) {
  const container = document.getElementById('promocodes-table');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = "styled-table";
  table.innerHTML = `
    <thead><tr><th>ID</th><th>Nom</th><th>Bénéfice</th><th>Actif</th></tr></thead>
    <tbody>
    ${data.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.benefit}</td><td>${p.status ? '✅' : '❌'}</td></tr>`).join('')}
    </tbody>`;
  container.appendChild(table);
}

async function listReviews() {
  if (!userToken) return alert("Connectez-vous d'abord.");
  try {
    const res = await fetch(`${API_URL}/api/dev/reviews`, { headers: { Authorization: `Bearer ${userToken}` }});
    const data = await res.json();
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
    <thead><tr><th>ID</th><th>Note</th><th>Description</th><th>Date</th></tr></thead>
    <tbody>
    ${data.map(r => `<tr><td>${r.id}</td><td>${r.rating}</td><td>${r.description}</td><td>${r.reviewDate}</td></tr>`).join('')}
    </tbody>`;
  container.appendChild(table);
}

async function listStats() {
  if (!userToken) return alert("Connectez-vous d'abord.");
  try {
    const res = await fetch(`${API_URL}/api/dev/stats`, { headers: { Authorization: `Bearer ${userToken}` }});
    const data = await res.json();
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
    <thead><tr><th>ID</th><th>User Profile</th></tr></thead>
    <tbody>
    ${data.map(s => `<tr><td>${s.id}</td><td>${s.user_profile_id}</td></tr>`).join('')}
    </tbody>`;
  container.appendChild(table);
}


async function deleteProduct(id) {
  if (!userToken) {
    alert("Merci de vous connecter ou utiliser le token admin.");
    return;
  }

  if (!confirm("Confirmer la suppression de ce produit ?")) return;

  try {
    const response = await fetch(`${API_URL}/api/dev/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    const result = await response.json();
    alert(result.message || "Produit supprimé.");
    listProducts(); // Recharge la liste
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la suppression du produit.");
  }
}

async function deleteService(id) {
  if (!userToken) {
    alert("Merci de vous connecter ou utiliser le token admin.");
    return;
  }

  if (!confirm("Confirmer la suppression de ce service ?")) return;

  try {
    const response = await fetch(`${API_URL}/api/dev/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    const result = await response.json();
    alert(result.message || "Service supprimé.");
    listServices(); // Recharge la liste
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la suppression du service.");
  }
}


async function createCart() {
  try {
    const res = await fetch(`${API_URL}/api/dev/carts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const data = await safeJsonResponse(res);
    if (data) alert("Panier créé !");
  } catch (e) {
    console.error(e);
    alert("Erreur création panier.");
  }
}

async function createPayment() {
  const amount = parseFloat(document.getElementById('payment-amount').value);
  const method = document.getElementById('payment-method').value;
  const status = document.getElementById('payment-status').value;

  try {
    const res = await fetch(`${API_URL}/api/dev/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, method, status })
    });
    const data = await safeJsonResponse(res);
    if (data) alert("Paiement ajouté !");
  } catch (e) {
    console.error(e);
    alert("Erreur création paiement.");
  }
}

async function assignPromoToService() {
  const promoId = document.getElementById('promo-id-service').value;
  const serviceId = document.getElementById('service-id').value;

  try {
    const res = await fetch(`${API_URL}/api/dev/promo-codes/${promoId}/service/${serviceId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const data = await safeJsonResponse(res);
    if (data) alert("Promo appliquée au service !");
  } catch (e) {
    console.error(e);
    alert("Erreur lors de l’application de la promo.");
  }
}

async function assignPromoToCategory() {
  const promoId = document.getElementById('promo-id-category').value;
  const categoryId = document.getElementById('category-id').value;

  try {
    const res = await fetch(`${API_URL}/api/dev/promo-codes/${promoId}/category/${categoryId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const data = await safeJsonResponse(res);
    if (data) alert("Promo appliquée à la catégorie !");
  } catch (e) {
    console.error(e);
    alert("Erreur lors de l’application de la promo.");
  }
}


async function createCartForUser() {
  const userId = document.getElementById('cart-user-id').value;

  try {
    const res = await fetch(`${API_URL}/api/dev/carts/user/${userId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const data = await safeJsonResponse(res);
    if (data) alert("Panier créé pour l'utilisateur !");
  } catch (e) {
    console.error(e);
    alert("Erreur création panier.");
  }
}

async function addProductToCart() {
  const cartId = document.getElementById('cart-id-product').value;
  const productId = document.getElementById('product-id-to-add').value;

  try {
    const res = await fetch(`${API_URL}/api/dev/carts/${cartId}/product/${productId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const data = await safeJsonResponse(res);
    if (data) alert("Produit ajouté au panier !");
  } catch (e) {
    console.error(e);
    alert("Erreur ajout produit au panier.");
  }
}

async function addServiceToCart() {
  const cartId = document.getElementById('cart-id-service').value;
  const serviceId = document.getElementById('service-id-to-add').value;

  try {
    const res = await fetch(`${API_URL}/api/dev/carts/${cartId}/service/${serviceId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const data = await safeJsonResponse(res);
    if (data) alert("Service ajouté au panier !");
  } catch (e) {
    console.error(e);
    alert("Erreur ajout service au panier.");
  }
}

