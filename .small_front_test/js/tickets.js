import { API_URL, TokenService, apiPrefix } from "./tokenService.js";


// HELPERS
function isAdmin() {
  const token = TokenService.getUserToken();
  if (!token) return false;
  const decoded = TokenService.decodeJWT(token);
  return decoded.role === 'admin';
}

function getEndpoint() {
  return isAdmin()
    ? `${API_URL}${apiPrefix()}/tickets`
    : `${API_URL}${apiPrefix()}/tickets`;
}


// LIST
export async function listTickets() {
  try {
    const res  = await TokenService.authFetch(getEndpoint());
    const text = await res.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error("Réponse invalide");
    renderTicketsTable(data);
    toggleTicketForm();  // masquer ou afficher le formulaire
  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement des tickets.");
  }
}


// RENDER
function renderTicketsTable(tickets) {
  const admin = isAdmin();
  const container = document.getElementById('tickets-table');
  container.innerHTML = '';

  if (!tickets.length) {
    container.innerText = "Aucun ticket trouvé.";
    return;
  }

  // EN-TÊTE
  const thActions = admin ? '<th>Actions</th>' : '';
  let html = `
    <table class="styled-table">
      <thead>
        <tr>
          <th>ID</th><th>Objet</th><th>Description</th><th>Statut</th><th>Date</th>
          ${thActions}
        </tr>
      </thead>
      <tbody>
  `;

  // LIGNES
  tickets.forEach(t => {
    const date = new Date(t.creationDate||t.createdDate).toLocaleDateString();
    const btnDelete = admin
      ? `<button onclick="deleteTicket(${t.id})">🗑️</button>`
      : '';
    html += `
      <tr>
        <td>${t.id}</td>
        <td>${t.subject}</td>
        <td>${t.description}</td>
        <td>${t.status}</td>
        <td>${date}</td>
        ${admin ? `<td>${btnDelete}</td>` : ''}
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// ADD
export async function addTicket() {
  if (!isAdmin()) {
    return alert("Vous n’êtes pas autorisé à créer des tickets.");
  }

  const subject     = document.getElementById('ticket-subject').value;
  const description = document.getElementById('ticket-description').value;
  try {
    await TokenService.authFetch(`${API_URL}/api/admin/tickets`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ subject, description })
    });
    alert("Ticket créé !");
    listTickets();
  } catch (err) {
    console.error(err);
    alert("Erreur création ticket.");
  }
}

// DELETE (admin only)
window.deleteTicket = async function(id) {
  if (!confirm("Supprimer ce ticket ?")) return;
  try {
    await TokenService.authFetch(`${API_URL}/api/admin/tickets/${id}`, {
      method: 'DELETE'
    });
    listTickets();
  } catch (err) {
    console.error(err);
    alert("Erreur suppression ticket.");
  }
};

// Afficher / masquer le formulaire de création
function toggleTicketForm() {
  const formSection = document.getElementById('ticket-form-container');
  if (isAdmin()) formSection.style.display = 'block';
  else            formSection.style.display = 'none';
}

// Expose au global pour ton HTML
window.listTickets = listTickets;
window.addTicket   = addTicket;