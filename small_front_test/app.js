
let userToken = localStorage.getItem('token') || null;
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NTc1NDEwNSwiZXhwIjoxNzc3MjkwMTA1fQ.QNfkzJmfAl1sXic4uXlJ5pcHpybY_gQ2snILAFZs0EM";

const API_URL = 'http://localhost:3007';


let currentPage = 1;
const pageSize = 20;

function useAdminToken() {
    userToken = ADMIN_TOKEN;
    localStorage.setItem('token', ADMIN_TOKEN);
    document.getElementById('current-token').innerText = "Token Admin utilisé";
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
  
      const data = await response.json();
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
  
// On branche le submit du form login automatiquement
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await login();
    });
  
    listUsers();
  });
  

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    login();
});

document.getElementById('address-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addAddress();
});


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

        const data = await response.json();
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

    const data = await response.json();
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

    const data = await response.json();
    document.getElementById('result').innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout de l'adresse.");
  }
  
}