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
import * as Utils from './js/utils.js';

import { TokenService, getUserToken, updateTokenDisplay } from './js/tokenService.js';

export const API_URL = window.location.origin;

// Exposition des fonctions au window pour le HTML
window.useAdminToken = Auth.useAdminToken;
window.reconnect = Auth.reconnect;
window.disconnect = Auth.disconnect;
window.getFreshAdminToken = TokenService.getFreshAdminToken;

window.listUsers = Users.listUsers;
window.createUser = Users.createUser;
window.createRole = Users.createRole;
window.assignRoleToUser = Users.assignRoleToUser;
window.signupUser = Auth.signupUser;
window.deleteRole = Users.deleteRole;

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

window.listStats = Stats.listStats;

window.listTickets = Tickets.listTickets;
window.addTicket = Tickets.addTicket;

window.createAdminProfile = Users.createAdminProfile;
window.listUserProfiles = Users.listUserProfiles;
window.displayRoles = Users.displayRoles;

window.testProtectedRoute = async () => {
  const res = await fetch(`${API_URL}/api/dev/admin-only`, {
    headers: {
      Authorization: `Bearer ${getUserToken()}`
    }
  });
  const text = await res.text();
  document.getElementById('test-result').innerText = text;
};


// Rendu DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log("[main] Initialisation session admin...");
  await TokenService.initAdminSession();
  console.log("[main] Session prête.");

  await new Promise(r => setTimeout(r, 300)); // Laisse le temps au token d’être bien propagé


  setInterval(() => {
    const token = getUserToken();
    if (token && TokenService.isExpired(token)) {
      console.log("[Auto Refresh] Token expiré, tentative de refresh...");
      const refresh = localStorage.getItem('refreshToken');
      if (refresh && !TokenService.isExpired(refresh)) {
        TokenService.refreshToken(refresh);
      }
    }
    updateTokenDisplay();
  }, 15000); // toutes les 15 secondes
  

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await Auth.login();
  });

  document.getElementById('address-form').addEventListener('submit', (e) => {
    e.preventDefault();
    Addresses.addAddress();
  });
  
  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    Products.addProduct();
  });

  
  document.getElementById('service-form').addEventListener('submit', (e) => {
    e.preventDefault();
    Services.addService();
  });

  await new Promise(r => setTimeout(r, 100));

  await Promise.all([
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