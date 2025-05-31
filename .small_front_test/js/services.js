import { API_URL, TokenService, apiPrefix } from "./tokenService.js";

async function listServices() {
  try {
    const response = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/services`
    );
    const services = await response.json();

    if (!Array.isArray(services)) {
      console.warn("⚠️ services attendu comme tableau mais reçu :", services);
      return;
    }

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
        <th>ID</th><th>Nom</th><th>Description</th><th>Prix</th>
        <th>Statut</th><th>Abonnement</th><th>Type</th>
        <th>Utilisateurs</th><th>Promotion</th>
        <th>Créé le</th><th>Mis à jour</th>
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
          <td>${new Date(s.createdAt).toLocaleString()}</td>
          <td>${new Date(s.updatedAt).toLocaleString()}</td>
          <td><button onclick="deleteService(${s.id})">🗑️ Supprimer</button></td>
        </tr>
      `).join('')}
    </tbody>
  `;


  container.appendChild(table);
}

async function addService() {
  const typeName = document.getElementById('service-subscriptionType').value;
  let serviceTypeId = null;

  try {
    // Chargement ou création du type
    const resTypes = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/service-types`
    );
    const types = await resTypes.json();
    const existing = types.find(t => t.name.toLowerCase() === typeName.toLowerCase());

    if (existing) {
      serviceTypeId = existing.id;
    } else {
      const resCreate = await TokenService.authFetch(
        `${API_URL}${apiPrefix()}/service-types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: typeName, description: `Type auto : ${typeName}` })
        }
      );
      const newType = await resCreate.json();
      serviceTypeId = newType.id;
    }

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

    const resService = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      }
    );
    await resService.json();

    alert("Service ajouté !");
    listServices();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout du service.");
  }
}

async function listServiceTypes() {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/service-types`
    );
    const types = await res.json();
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
      <tr><th>ID</th><th>Nom</th><th>Description</th><th>Créé le</th></tr>
    </thead>
    <tbody>
      ${types.map(t => `
        <tr>
          <td>${t.id}</td>
          <td>${t.name}</td>
          <td>${t.description || '-'}</td>
          <td>${new Date(t.createdAt).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  container.appendChild(table);
}

async function deleteService(id) {
  if (!confirm("Confirmer la suppression de ce service ?")) return;

  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/services/${id}`, { method: 'DELETE' }
    );
    const result = await res.json();
    alert(result.message || "Service supprimé.");
    listServices();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la suppression du service.");
  }
}

async function loadServicesIntoSelect(selectId) {
  try {
    const res = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/services`
    );
    const services = await res.json();
    if (!Array.isArray(services)) {
      console.warn(`⚠️ services attendu comme tableau mais reçu :`, services);
      return;
    }
    const select = document.getElementById(selectId);
    select.innerHTML = services
      .map(s => `<option value="${s.id}">${s.name}</option>`)
      .join('');
  } catch (e) {
    console.error(e);
    alert("Erreur chargement services pour select.");
  }
}

export {
  listServices,
  listServiceTypes,
  renderServiceTypesTable,
  addService,
  deleteService,
  loadServicesIntoSelect
};
