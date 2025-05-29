import { API_URL, TokenService, apiPrefix } from "./tokenService.js";
const BASE = API_URL + apiPrefix();

async function loadMyProfile() {
  try {
    const res = await TokenService.authFetch(
      `${BASE}/profile/me`
    );
    const profile = await TokenService.safeJsonResponse(res);

    const container = document.getElementById('my-profile');
    if (!profile) {
      container.innerText = "Profil introuvable ou erreur serveur.";
      return;
    }

    container.innerHTML = `
      <table class="styled-table">
        <tr><th>ID Profil</th><td>${profile.id}</td></tr>
        <tr><th>User ID</th><td>${profile.user_id}</td></tr>
        <tr><th>Adresses</th><td>${profile.addresses?.length || 0}</td></tr>
      </table>
    `;
  } catch (e) {
    console.error(e);
    document.getElementById('my-profile').innerText =
      "Erreur lors du chargement de votre profil.";
  }
}

async function loadMyAddresses() {
  try {
    const res = await TokenService.authFetch(
      `${BASE}/profile/addresses`
    );
    const addresses = await TokenService.safeJsonResponse(res);

    const container = document.getElementById('my-addresses');
    if (!Array.isArray(addresses) || addresses.length === 0) {
      container.innerText = "Aucune adresse enregistrée.";
      return;
    }

    container.innerHTML = `
      <table class="styled-table">
        <thead>
          <tr><th>ID</th><th>Adresse</th><th>Ville</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${addresses
            .map(
              a => `
            <tr>
              <td>${a.id}</td>
              <td>${a.address1}</td>
              <td>${a.city}</td>
              <td><button onclick="deleteMyAddress(${a.id})">🗑 Supprimer</button></td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;
  } catch (e) {
    console.error(e);
    document.getElementById('my-addresses').innerText =
      "Erreur lors du chargement des adresses.";
  }
}

async function addMyAddress() {
  try {
    const addressData = {
      address1: document.getElementById('address1').value,
      city: document.getElementById('city').value,
      postalCode: document.getElementById('postalCode').value,
      region: document.getElementById('region')?.value || '',
      country: document.getElementById('country')?.value || '',
      type: document.getElementById('type')?.value || ''
    };

    const res = await TokenService.authFetch(
      `${BASE}/profile/addresses`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      }
    );
    await TokenService.safeJsonResponse(res);
    alert("Adresse ajoutée !");
    await loadMyAddresses();
  } catch (e) {
    console.error(e);
    alert("Erreur lors de l'ajout de l'adresse.");
  }
}

async function deleteMyAddress(addressId) {
  try {
    if (!confirm("Supprimer cette adresse ?")) return;
    const res = await TokenService.authFetch(
      `${BASE}/profile/addresses/${addressId}`,
      { method: 'DELETE' }
    );
    await TokenService.safeJsonResponse(res);
    alert("Adresse supprimée !");
    await loadMyAddresses();
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la suppression de l'adresse.");
  }
}

window.promptEditAddress = async function() {
  const id      = parseInt(prompt("ID de l'adresse à modifier ?"),10);
  if (!id) return;
  const a       = await TokenService.authFetch(
    `${BASE}/profile/me/addresses/${id}`
  ).then(r => r.json());
  if (!a.id) { alert("Adresse non trouvée"); return; }

  const address1  = prompt("Nouvelle adresse", a.address1);
  const city      = prompt("Nouvelle ville",   a.city);
  const postalCode= prompt("Code postal",       a.postalCode);
  const region    = prompt("Région",            a.region);
  const country   = prompt("Pays",              a.country);
  const type      = prompt("Type",              a.type);

  try {
    const res = await TokenService.authFetch(
      `${BASE}/profile/me/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address1, city, postalCode, region, country, type })
      }
    );
    await TokenService.safeJsonResponse(res);
    alert("Adresse mise à jour !");
    loadMyAddresses();
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la mise à jour de l'adresse.");
  }
};


window.loadMyProfile = loadMyProfile;
window.loadMyAddresses = loadMyAddresses;
window.addMyAddress = addMyAddress;
window.deleteMyAddress = deleteMyAddress;
