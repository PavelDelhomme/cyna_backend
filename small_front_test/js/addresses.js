import { API_URL, TokenService, apiPrefix } from "./tokenService.js";

async function addAddress() {
  const userId = document.getElementById('user-id-address-select').value;

  const addressData = {
    address1: document.getElementById('address1').value,
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode').value,
    region: document.getElementById('region').value,
    country: document.getElementById('country').value,
    type: document.getElementById('type').value
  };

  try {
    const response = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/addresses/${userId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      }
    );

    const data = await TokenService.safeJsonResponse(response);
    if (data) {
      document.getElementById('result').innerText = JSON.stringify(data, null, 2);
    }
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout de l'adresse.");
  }
}

async function getMyAddresses() {
  try {
    const response = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/addresses/me`
    );
    const data = await TokenService.safeJsonResponse(response);

    const container = document.getElementById('addresses-list');
    if (!Array.isArray(data)) {
      container.innerText = "Erreur lors du chargement des adresses.";
      return;
    }
    if (data.length === 0) {
      container.innerText = "Aucune adresse enregistrée.";
      return;
    }

    container.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    document.getElementById('addresses-list').innerText = "Erreur réseau ou serveur.";
  }
}

async function listAllAddresses() {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/addresses`
    );
    const data = await TokenService.safeJsonResponse(res);
    document.getElementById('addresses-list').innerText = JSON.stringify(data, null, 2);
  } catch (e) {
    console.error("Erreur chargement adresses admin :", e);
    alert("Erreur lors du chargement de toutes les adresses.");
  }
}

export { addAddress, getMyAddresses, listAllAddresses };
