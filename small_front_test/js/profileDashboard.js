import { API_URL, TokenService } from "./tokenService.js";

async function loadMyProfile() {
    try {
        const res = await TokenService.authFetch(`${API_URL}/api/profile/me`);
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
    document.getElementById('my-profile').innerText = "Erreur lors du chargement de votre profil.";
  }
}


async function loadMyAddresses() {
  try {
    const res = await TokenService.authFetch(`${API_URL}/api/profile/me/addresses`);
    const addresses = await TokenService.safeJsonResponse(res);

    const container = document.getElementById('my-addresses');
    if (!addresses || addresses.length === 0) {
      container.innerText = "Aucune adresse enregistrée.";
      return;
    }

    container.innerHTML = `
      <table class="styled-table">
        <thead><tr><th>ID</th><th>Adresse</th><th>Ville</th><th>Actions</th></tr></thead>
        <tbody>
          ${addresses.map(a => `
            <tr>
              <td>${a.id}</td>
              <td>${a.address1}</td>
              <td>${a.city}</td>
              <td>
                <button onclick="deleteMyAddress(${a.id})">🗑 Supprimer</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (e) {
    console.error(e);
    document.getElementById('my-addresses').innerText = "Erreur lors du chargement des adresses.";
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
      type: document.getElementById('type')?.value || '',
    };

    const res = await TokenService.authFetch(`${API_URL}/api/profile/me/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData)
    });

    const data = await TokenService.safeJsonResponse(res);
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
    const res = await TokenService.authFetch(`${API_URL}/api/profile/me/addresses/${addressId}`, {
      method: 'DELETE'
    });

    const data = await TokenService.safeJsonResponse(res);
    alert("Adresse supprimée !");
    await loadMyAddresses();
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la suppression de l'adresse.");
  }
}

window.loadMyProfile = loadMyProfile;
window.loadMyAddresses = loadMyAddresses;
window.addMyAddress = addMyAddress;
window.deleteMyAddress = deleteMyAddress;