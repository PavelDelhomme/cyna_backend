import { API_URL, TokenService } from "./tokenService.js";

async function listTickets() {
    try {
      const res = await TokenService.authFetch(`${API_URL}/api/dev/tickets`);
      const text = await res.text();
      console.log('[DEBUG] Réponse brute :', text);
  
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("La réponse n'était pas du JSON valide :", text);
        alert("Erreur côté serveur : réponse invalide.");
        return;
      }
  
      if (!Array.isArray(data)) {
        console.warn(`⚠️ tickets attendu comme tableau mais reçu :`, data);
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

    if (!data || data.length === 0) {
        container.innerText = "Aucun ticket trouvé.";
        return;
    }

    const table = document.createElement('table');
    table.className = "styled-table";
    table.innerHTML = `
      <thead><tr><th>ID</th><th>Objet</th><th>Description</th><th>Statut</th><th>Date</th></tr></thead>
      <tbody>
        ${data.map(t => `
          <tr>
            <td>${t.id}</td>
            <td>${t.subject}</td>
            <td>${t.description}</td>
            <td>${t.status}</td>
            <td>${new Date(t.creationDate || t.created_at).toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    container.appendChild(table);
}


async function addTicket() {
    const ticket = {
      subject: document.getElementById('ticket-subject').value,
      description: document.getElementById('ticket-description').value
    };
  
    try {
      const response = await TokenService.authFetch(`${API_URL}/api/dev/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      });
  
      const text = await response.text();
      console.log('[DEBUG] Ticket ajouté réponse :', text);
  
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        alert("Erreur inattendue lors de la création du ticket.");
        return;
      }
  
      alert("Ticket ajouté !");
      listTickets();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du ticket.");
    }
}

export { listTickets, addTicket };