import * as Auth from './js/auth.js';
import * as Users from './js/users.js';
import * as Addresses from './js/addresses.js';
import * as Products from './js/products.js';
import * as Services from './js/services.js';
import * as Payments from './js/payments.js';
import * as Orders from './js/order.js';
import * as Carts from './js/cart.js';
import * as Promo from './js/promo.js';
import * as Reviews from './js/reviews.js';
import * as Stats from './js/stats.js';
import * as Tickets from './js/tickets.js';

import { TokenService, API_URL, apiPrefix } from './js/tokenService.js';
import './js/profileDashboard.js';

export { API_URL };

// Exposition des fonctions au window pour le HTML
window.useAdminToken = Auth.useAdminToken;
window.reconnect = Auth.reconnect;
window.disconnect = Auth.disconnect;
window.getFreshAdminToken = TokenService.getFreshAdminToken;
window.forceResetAndFetchAdminToken = TokenService.forceResetAndFetchAdminToken;
window.forceAdmin = Auth.forceAdmin;
window.forceUser = Auth.forceUser;

window.listUsers = Users.listUsers;
window.createUser = Users.createUser;
window.createRole = Users.createRole;
window.assignRoleToUser = Users.assignRoleToUser;
window.signupUser = Auth.signupUser;
window.deleteRole = Users.deleteRole;
window.switchToUser = Users.switchToUser;

window.getMyProfile = Users.getMyProfile;
window.updateMyProfile = Users.updateMyProfile;
window.deleteMyProfile = Users.deleteMyProfile;

window.listAllAddresses = Addresses.listAllAddresses;
window.getMyAddresses = Addresses.getMyAddresses;

window.listProducts = Products.listProducts;
window.addProduct = Products.addProduct;
window.listProductcategories = Products.listProductCategories;
window.deleteProduct = Products.deleteProduct;

window.listServices = Services.listServices;
window.addService = Services.addService;
window.listServiceTypes = Services.listServiceTypes;
window.deleteService = Services.deleteService;

window.listPayments = Payments.listPayments;
window.createPayment = Payments.createPayment;

window.listOrders = Orders.listOrders;

window.listCarts = Carts.listCarts;
window.createCartForUser = Carts.createCartForUser;
window.addProductToCart = Carts.addProductToCart;
window.addServiceToCart = Carts.addServiceToCart;

window.listPromocodes = Promo.listPromocodes;
window.assignPromoToProduct = Promo.assignPromoToProduct;
window.assignPromoToService = Promo.assignPromoToService;
window.assignPromoToCategory = Promo.assignPromoToCategory;

window.listReviews = Reviews.listReviews;
window.createReview = Reviews.createReview;

window.listStats = Stats.listStats;

window.listTickets = Tickets.listTickets;
window.addTicket = Tickets.addTicket;

window.createAdminProfile = Users.createAdminProfile;
window.listUserProfiles = Users.listUserProfiles;
window.displayRoles = Users.displayRoles;

// Test d'accès admin-only (si vous avez encore une route de test sous /dev/admin-only)
window.testProtectedRoute = async () => {
  const res = await fetch(
    `${API_URL}${apiPrefix()}/dev/admin-only`,
    { headers: { Authorization: `Bearer ${TokenService.getUserToken()}` } }
  );
  document.getElementById('test-result').innerText = await res.text();
};

// Au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
  console.log("[main] Initialisation session admin...");
  await TokenService.initAdminSession();
  await TokenService.validateAndAutoFixSession();
  console.log("[main] Session prête.");

  // Petite pause pour que tout s'initialise
  await new Promise(r => setTimeout(r, 300));

  // Auto-refresh du token
  setInterval(() => {
    if (TokenService.isExpired(TokenService.getUserToken())) {
      const refresh = localStorage.getItem('refreshToken');
      if (refresh && !TokenService.isExpired(refresh)) {
        TokenService.refreshToken(refresh);
      }
    }
    TokenService.updateTokenDisplay();
  }, 15000);

  // Liaison des formulaires
  document
    .getElementById('login-form')
    .addEventListener('submit', e => { e.preventDefault(); Auth.login(); });
  document
    .getElementById('address-form')
    .addEventListener('submit', e => { e.preventDefault(); Addresses.addAddress(); });
  document
    .getElementById('product-form')
    .addEventListener('submit', e => { e.preventDefault(); Products.addProduct(); });
  document
    .getElementById('service-form')
    .addEventListener('submit', e => { e.preventDefault(); Services.addService(); });

  // Chargement initial des sélecteurs et des listes
  await Promise.all([
    populateUserSelect(),
    Promo.loadPromosIntoSelect("promo-id"),
    Promo.loadPromosIntoSelect("promo-id-service"),
    Promo.loadPromosIntoSelect("promo-id-category"),
    Products.loadProductsIntoSelect("product-id"),
    Products.loadProductsIntoSelect("product-id-to-add"),
    Services.loadServicesIntoSelect("service-id"),
    Services.loadServicesIntoSelect("service-id-to-add"),
    Products.loadProductCategoriesIntoSelect("category-id"),
    Users.loadUsersIntoSelect("role-user-id"),
    Users.loadRolesIntoSelect("role-id")
  ]);

  // Affichage initial
  Users.listUsers();
  Payments.listPayments();
  Orders.listOrders();
  Reviews.listReviews();
  Tickets.listTickets();
  Stats.listStats();
  Addresses.getMyAddresses();
  Carts.listCarts();
  Promo.listPromocodes();
});

// Remplit le select des utilisateurs
async function populateUserSelect() {
  try {
    const res    = await TokenService.authFetch(
      `${API_URL}${apiPrefix()}/users`
    );
    const users  = await res.json();
    const select = document.getElementById('user-id-address-select');
    select.innerHTML = '';
    users.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.text  = `${u.name} (${u.email})`;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error("Erreur chargement utilisateurs:", e);
  }
}


// --- Profil utilisateur ---
async function reloadMyAddresses() {
  const list = await Addresses.getMyAddresses();
  const container = document.getElementById('my-addresses');
  container.innerHTML = list.map(a =>
    `<div>(${a.id}) ${a.address1}, ${a.city} 
       <button onclick="prefillEditAddress(${a.id})">✏️</button>
     </div>`
  ).join('');
}

window.reloadMyAddresses = reloadMyAddresses;
window.reloadAllAddresses = reloadAllAddresses;

document
  .getElementById('add-my-address-form')
  .addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      address1: document.getElementById('address1-my').value,
      city:     document.getElementById('city-my').value,
      postalCode: document.getElementById('postalCode-my').value,
      region:   document.getElementById('region-my').value,
      country:  document.getElementById('country-my').value,
      type:     document.getElementById('type-my').value,
    };
    await Addresses.addMyAddress(data);
    alert("Adresse ajoutée");
    reloadMyAddresses();
  });

// remplir le formulaire de modif
window.prefillEditAddress = id => {
  document.getElementById('edit-address-id').value = id;
  // tu peux aussi load l’adresse dans un petit form si tu veux
};

window.promptEditAddress = async () => {
  const id = +document.getElementById('edit-address-id').value;
  // pour simplifier on fait un prompt sur chaque champ
  const address1 = prompt("Nouvelle adresse1 ?");
  const city     = prompt("Nouvelle ville ?");
  // … etc
  await Addresses.updateMyAddress(id, { address1, city });
  alert("Adresse mise à jour");
  reloadMyAddresses();
};

window.removeMyAddress = async () => {
  const id = +document.getElementById('edit-address-id').value;
  if (!confirm("Supprimer cette adresse ?")) return;
  await Addresses.deleteMyAddress(id);
  alert("Adresse supprimée");
  reloadMyAddresses();
};


// --- Admin global ---
async function reloadAllAddresses() {
  const all = await Addresses.listAllAddresses();
  const cont = document.getElementById('all-addresses');
  cont.innerHTML = all.map(a =>
    `<div>(${a.id}) ${a.address1}, ${a.city}</div>`
  ).join('');
}

window.promptAdminEditAddress = async () => {
  const id = +document.getElementById('admin-edit-address-id').value;
  const address1 = prompt("Nouvelle adresse1 ?");
  const city     = prompt("Nouvelle ville ?");
  await Addresses.updateAddress(id, { address1, city });
  alert("Adresse admin mise à jour");
  reloadAllAddresses();
};

window.removeAddress = async () => {
  const id = +document.getElementById('admin-delete-address-id').value;
  if (!confirm("Supprimer cette adresse (admin) ?")) return;
  await Addresses.deleteAddress(id);
  alert("Adresse admin supprimée");
  reloadAllAddresses();
};