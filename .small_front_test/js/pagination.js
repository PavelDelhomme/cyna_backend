export let currentPage = 1;
export const pageSize = 20;

export function renderPagination(totalItems, currentPage) {
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