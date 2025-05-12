import { API_URL, TokenService } from "./tokenService.js";

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
        const response = await TokenService.authFetch(`${API_URL}/api/dev/addresses/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addressData)
        });
  
        const data = await TokenService.safeJsonResponse(response);
        if (!data) return;
        document.getElementById('result').innerText = JSON.stringify(data, null, 2);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de l'adresse.");
    }
}

  
async function getMyAddresses() {
    try {
        const response = await TokenService.authFetch(`${API_URL}/api/addresses/me`);
        const data = await TokenService.safeJsonResponse(response);
    
        const container = document.getElementById('addresses-list');
        if (!data || !Array.isArray(data)) {
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
      }}


export { addAddress, getMyAddresses }