import { API_URL, getUserToken, authFetch } from "./tokenService.js";
import { safeJsonResponse } from "./utils.js";

async function listPromocodes() {
    try {
        const res = await authFetch(`${API_URL}/api/dev/promo-codes`);
        const data = await res.json();
        renderPromocodesTable(data);
    } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des codes promo.");
    }
}


  

function renderPromocodesTable(data) {
    const container = document.getElementById('promocodes-table');
    container.innerHTML = '';
    const table = document.createElement('table');
    table.className = "styled-table";
    table.innerHTML = `
        <thead><tr><th>ID</th><th>Nom</th><th>Bénéfice</th><th>Actif</th></tr></thead>
        <tbody>
        ${data.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.benefit}</td><td>${p.status ? '✅' : '❌'}</td></tr>`).join('')}
        </tbody>`;
    container.appendChild(table);
}



async function assignPromoToProduct() {
    const promoId = document.getElementById('promo-id').value;
    const productId = document.getElementById('product-id').value;

    try {
        const res = await authFetch(`${API_URL}/api/dev/promo-codes/${promoId}/product/${productId}`, {
            method: 'POST'
        });

        const data = await safeJsonResponse(res);
        if (data) alert("Promo appliquée au produit !");
    } catch (e) {
        console.error(e);
        alert("Erreur lors de l’application de la promo.");
    }
}
  
  
async function assignPromoToService() {
    const promoId = document.getElementById('promo-id-service').value;
    const serviceId = document.getElementById('service-id').value;

    try {
        const res = await authFetch(`${API_URL}/api/dev/promo-codes/${promoId}/service/${serviceId}`, {
            method: 'POST'
        });

        const data = await safeJsonResponse(res);
        if (data) alert("Promo appliquée au service !");
    } catch (e) {
        console.error(e);
        alert("Erreur lors de l’application de la promo.");
    }
}
  
  
async function assignPromoToCategory() {
    const promoId = document.getElementById('promo-id-category').value;
    const categoryId = document.getElementById('category-id').value;

    try {
        const res = await authFetch(`${API_URL}/api/dev/promo-codes/${promoId}/category/${categoryId}`, {
            method: 'POST'
        });

        const data = await safeJsonResponse(res);
        if (data) alert("Promo appliquée à la catégorie !");
    } catch (e) {
        console.error(e);
        alert("Erreur lors de l’application de la promo.");
    }
}


async function loadPromosIntoSelect(selectId) {
    try {
        const res = await authFetch(`${API_URL}/api/dev/promo-codes`);
        const promos = await res.json();
        if (!Array.isArray(promos)) {
            console.warn(`⚠️ promos attendu comme tableau mais reçu :`, promos);
            return;
        }
        const select = document.getElementById(selectId);
        select.innerHTML = promos.map(p => `<option value="${p.id}">${p.code}</option>`).join('');
    } catch (e) {
        console.error(e);
        alert("Erreur lors du chargement des promotions.");
    }
}


export {
    listPromocodes,
    renderPromocodesTable,
    assignPromoToProduct,
    assignPromoToService,
    assignPromoToCategory,
    loadPromosIntoSelect
};