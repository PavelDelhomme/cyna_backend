import { API_URL, TokenService, apiPrefix } from "./tokenService.js";

export function formatDate(obj, field = 'created') {
  const iso = obj[`${field}At`] || obj[`${field}_at`];
  return iso ? new Date(iso).toLocaleString() : '';
}


// Liste et rend **toutes** les adresses en tableau (admin)
async function renderAllAddressesTable() {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/addresses`
  );
  const addresses = await TokenService.safeJsonResponse(res);
  const container = document.getElementById('addresses-list');
  container.innerHTML = '';

  if (!Array.isArray(addresses) || addresses.lengh === 0) {
    container.innerText = "Aucune adresse trouvée.";
    return;
  }

  
  const table = document.createElement('table');
  table.className = 'styled-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th><th>User ID</th><th>Adresse</th><th>Ville</th>
        <th>Code postal</th><th>Région</th><th>Pays</th><th>Type</th>
        <th>Créé le</th><th>Mis à jour</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${addresses.map(a => `
        <tr>
          <td>${a.id}</td>
          <td>${a.AddressUserProfile?.user_profile_id || '—'}</td>
          <td>${a.address1}</td>
          <td>${a.city}</td>
          <td>${a.postalCode}</td>
          <td>${a.region || '-'}</td>
          <td>${a.country || '-'}</td>
          <td>${a.type || '-'}</td>
          <td>${formatDate(a, 'created')}</td>
          <td>${formatDate(a, 'updated')}</td>
          <td>
            <button onclick="promptAdminEditAddress(${a.id})">✏️</button>
            <button onclick="removeAddress(${a.id})">🗑️</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  container.appendChild(table);
}

/** → UTILISATEUR (profil) **/
// Récupère mes adresses
async function getMyAddresses() {
  const res = await TokenService.authFetch(`${API_URL}/api/profile/addresses`);
  return TokenService.safeJsonResponse(res);
}

// Ajoute une adresse à mon profil
async function addMyAddress(data) {
  const res = await TokenService.authFetch(
    `${API_URL}/api/profile/addresses`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return TokenService.safeJsonResponse(res);
}

// Modifie une de mes adresses
async function updateMyAddress(id, data) {
  const res = await TokenService.authFetch(
    `${API_URL}/api/profile/addresses/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return TokenService.safeJsonResponse(res);
}

// Supprime une de mes adresses
async function deleteMyAddress(id) {
  await TokenService.authFetch(
    `${API_URL}/api/profile/addresses/${id}`,
    { method: "DELETE" }
  );
}


/** → ADMIN **/
// Liste **toutes** les adresses du système
async function listAllAddresses() {
  const res = await TokenService.authFetch(
    `${API_URL}/api/addresses`
  );
  return TokenService.safeJsonResponse(res);
}

// Crée une adresse pour n’importe quel user (admin)
async function addAddressForUser(userId, data) {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/addresses/user/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return TokenService.safeJsonResponse(res);
}

// Modifie n’importe quelle adresse (admin)
async function updateAddress(id, data) {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/admin/addresses/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return TokenService.safeJsonResponse(res);
}

// Supprime n’importe quelle adresse (admin)
async function deleteAddress(id) {
  await TokenService.authFetch(
    `${API_URL}/api/admin/addresses/${id}`,
    { method: "DELETE" }
  );
}

async function renderMyAddressesTable() {
  const res = await TokenService.authFetch(
    `${API_URL}/api/profile/addresses`
  );
  const addresses = await TokenService.safeJsonResponse(res);
  const container = document.getElementById('my-addresses');
  container.innerHTML = '';

  if (!addresses.length) {
    container.innerText = "Vous n’avez pas encore d’adresse.";
    return;
  }

  const table = document.createElement('table');
  table.className = 'styled-table';
  table.innerHTML = `
    <thead>
      <tr><th>ID</th><th>Adresse</th><th>Ville</th><th>Créé le</th>
          <th>Mis à jour</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${addresses.map(a => `
        <tr>
          <td>${a.id}</td>
          <td>${a.address1}</td>
          <td>${a.city}</td>
          <td>${formatDate(a, 'created')}</td>
          <td>${formatDate(a, 'updated')}</td>
          <td>
            <button onclick="prefillEditAddress(${a.id})">✏️</button>
            <button onclick="removeMyAddress(${a.id})">🗑️</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;
  container.appendChild(table);
}


export { 
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
  listAllAddresses,
  addAddressForUser,
  updateAddress,
  deleteAddress,
  renderAllAddressesTable,
  renderMyAddressesTable
};
