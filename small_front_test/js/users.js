import { API_URL, TokenService, apiPrefix } from "./tokenService.js";
import { renderPagination } from "./pagination.js";

const pageSize = 10;


async function listUsers(page = 1) {
  try {
    // plus "/api/dev/users"
    const response = await TokenService.authFetch(`${API_URL}${apiPrefix()}/users`);
    const users = await response.json();

    if (!Array.isArray(users)) {
      console.warn(`⚠️ users attendu comme tableau mais reçu :`, users);
      return;
    }

    const start = (page - 1) * pageSize;
    const paginatedUsers = users.slice(start, start + pageSize);

    renderUsersTable(paginatedUsers);
    renderPagination(users.length, page);
  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement des utilisateurs.");
  }
}

async function switchToUser(userId, email) {
  try {
    // plus "/api/dev/tokens"
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/tokens`
    );
    const tokens = await res.json();

    const userToken = tokens.find(t => t.id === userId);

    if (!userToken) {
      alert("Impossible de trouver le token de cet utilisateur.");
      console.error("[switchToUser] impossible de trouver le token de cet utilisateur.");
      return;
    }

    localStorage.setItem('token', userToken.token);
    localStorage.setItem("forcedMode", "custom");
    TokenService.forcedAdmin = false;
    TokenService.forcedUser = false;
    alert(`Connecté en tant que ${email}`);
    TokenService.updateTokenDisplay();
  } catch (e) {
    console.error('[switchToUser] Erreur :', e);
    alert("Erreur lors du switch utilisateur.");
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
        <th>ID</th><th>Nom</th><th>Email</th><th>Rôle</th>
        <th>Créé le</th><th>Mis à jour</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${users.map(u => `
        <tr>
          <td>${u.id}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.role?.name || 'N/A'}</td>
          <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
          <td>${u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : '—'}</td>
          <td><button onclick="switchToUser(${u.id}, '${u.email}')">🔄 Utiliser</button></td>
        </tr>`).join('')}
    </tbody>
  `;

  container.appendChild(table);
}


async function createUser() {
  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;

  try {
    // plus "/api/dev/users"
    const response = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      }
    );

    const data = await TokenService.safeJsonResponse(response);
    if (data) {
      alert("Utilisateur créé !");
      loadUsersIntoSelect("role-user-id");
      listUsers();
    }
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la création de l'utilisateur.");
  }
}


async function createRole() {
  const name = document.getElementById('role-name').value.trim();

  // ✅ Validation sécurisée
  if (name.length === 0 || name.length > 255) {
    alert("Nom de rôle invalide (vide ou trop long).");
    return;
  }

  try {
    // plus "/api/dev/roles"
    const response = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      }
    );

    const data = await TokenService.safeJsonResponse(response);
    if (data) {
      alert("Rôle créé !");
      loadRolesIntoSelect("role-id");
      loadUsersIntoSelect("role-user-id");
      listUsers();
    }
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la création du rôle.");
  }
}


async function assignRoleToUser() {
  const userId = document.getElementById('role-user-id').value;
  const roleId = document.getElementById('role-id').value;

  try {
    const url = `${API_URL}${apiPrefix()}/users/${userId}/roles/${roleId}`;
    const res = await TokenService.authFetch(url, {
      method: 'POST'
      // pas besoin de body puisque le roleId est dans l’URL
    });
    await TokenService.safeJsonResponse(res);
    alert("Rôle assigné avec succès !");
    listUsers();            // pour rafraîchir l’affichage
    loadUsersIntoSelect("role-user-id");
  } catch (e) {
    console.error(e);
    alert("Erreur lors de l’assignation du rôle.");
  }
}


async function loadUsersIntoSelect(selectId) {
  // plus "/api/dev/users"
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/users`
  );
  const users = await res.json();
  if (!Array.isArray(users)) {
    console.warn(`⚠️ users attendu comme tableau mais reçu :`, users);
    return;
  }
  const select = document.getElementById(selectId);
  select.innerHTML = users.map(u => `<option value="${u.id}">${u.name} (${u.email})</option>`).join('');
}


async function loadRolesIntoSelect(selectId) {
  // plus "/api/dev/roles"
  const res   = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/roles`
  );
  const roles = await res.json();
  if (!Array.isArray(roles)) {
    console.warn(`⚠️ roles attendu comme tableau mais reçu :`, roles);
    return;
  }
  const select = document.getElementById(selectId);
  select.innerHTML = roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
}

async function createAdminProfile() {
  try {
    // plus "/api/dev/admin/profile"
    const response = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/admin/profiles/admin`, { method: "POST" }
    );
    const data = await safeJsonResponse(response);
    if (data.message) {
      alert(data.message);
    }
    console.log("Profil admin :", data.profile);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la création du profil admin.");
  }
}

async function listUserProfiles() {
  try {
    // plus "/api/dev/profiles"
    const response = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/admin/profiles`
    );
    const profiles = await response.json();

    const container = document.getElementById('user-profiles-table');
    if (!Array.isArray(profiles) || profiles.length === 0) {
      container.innerText = "Aucun profil utilisateur.";
      return;
    }

    const table = document.createElement('table');
    table.className = "styled-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID Profil</th>
          <th>User ID</th>
          <th>Nom</th>
          <th>Email</th>
          <th># Adresses</th>
          <th>Créé le</th>
          <th>Mis à jour</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${profiles.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.user_id}</td>
            <td>${p.User?.name || ''}</td>
            <td>${p.User?.email || ''}</td>
            <td>${p.addresses?.length || 0}</td>
            <td>${new Date(p.createdAt).toLocaleString()}</td>
            <td>${new Date(p.updatedAt).toLocaleString()}</td>
            <td>
              <button onclick="promptEditUser(${p.user_id}, '${p.User?.name}', '${p.User?.email}')">✏️ Modifier</button>
              <button onclick="deleteUserProfile(${p.user_id})">🗑 Supprimer profil</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    container.innerHTML = '';
    container.appendChild(table);
  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement des profils.");
  }
}
async function displayRoles() {
  try {
    // plus "/api/dev/roles"
    const res   = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/roles`
    );
    const roles = await res.json();

    if (!Array.isArray(roles)) {
      console.warn("Réponse inattendue :", roles);
      return;
    }

    const container = document.getElementById("roles-list");
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = "styled-table";
    table.innerHTML = `
      <thead>
        <tr><th>ID</th><th>Nom</th><th>Créé le</th><th>Actions</th></tr>
      </thead>
      <tbody>
        ${roles.map(r => `
          <tr>
            <td>${r.id}</td>
            <td>${r.name}</td>
            <td>${new Date(r.createdAt).toLocaleDateString()}</td>
            <td>
              <button onclick="deleteRole(${r.id})">🗑 Supprimer</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    container.appendChild(table);

  } catch (e) {
    console.error(e);
    alert("Erreur lors de l'affichage des rôles.");
  }
}

async function deleteRole(roleId) {
  if (!confirm("Supprimer ce rôle ?")) return;

  try {
    // plus "/api/dev/roles/:roleId"
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/roles/${roleId}`, { method: 'DELETE' }
    );

    const data = await res.json();
    if (res.ok) {
      alert("Rôle supprimé !");
      displayRoles();
      loadRolesIntoSelect("role-id");
    } else {
      alert("Erreur : " + (data.error || "Échec suppression."));
    }
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la suppression du rôle.");
  }
}

async function getMyProfile() {
  try {
    // passe aussi par apiPrefix()
    const res     = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/profile/me`
    );
    const profile = await res.json();
    console.log("[getMyProfile] Profile courant :", profile);
    alert(`Votre profile : ID ${profile.id}, User ID ${profile.user_id}`);
  } catch (e) {
    console.error("[getMyProfile] Erreur :", e);
    alert("Erreur lors du chargement de votre profile.");
  }
}

async function updateMyProfile(data) {
  try {
    const res     = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/profile/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    const updated = await res.json();
    alert("Profil mis à jour !");
    console.log(updated);
  } catch (e) {
    console.error("Erreur lors de la mise à jour du profil : ", e);
    alert("Erreur lors de la mise à jour du profil");
  }
}


async function deleteMyProfile() {
  try {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre profile ?")) return;
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/profile/me`, { method: 'DELETE' }
    );
    await res.json();
    alert("Profil supprimé !");
    TokenService.disconnect();
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la suppression du profil");
  }
}


// Ouvre un prompt, puis appel PATCH /api/admin/userrs/:id
window.promptEditUser = async function(userId, currentName, currentEmail) {
  const name = prompt("Nouveau nom ?", currentName);
  const email = prompt("Nouveau email ?", currentEmail);
  if (name == null || email == null) return;

  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      }
    );
    const data = await TokenService.safeJsonResponse(res);
    if (res.ok) {
      alert("Utilisateur mis à jour !");
      listUserProfiles();    // rafraîchir le tableau
    } else {
      alert("Erreur : " + (data.error || "Échec mise à jour"));
    }
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la mise à jour de l'utilisateur.");
  }
};

export {
  listUsers,
  createUser,
  createRole,
  assignRoleToUser,
  loadRolesIntoSelect,
  loadUsersIntoSelect,
  createAdminProfile,
  listUserProfiles,
  displayRoles,
  deleteRole,
  switchToUser,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile
};