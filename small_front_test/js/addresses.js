import { API_URL, TokenService, apiPrefix } from "./tokenService.js";


/** → UTILISATEUR (profil) **/
// Récupère mes adresses
async function getMyAddresses() {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/profile/addresses`
  );
  return TokenService.safeJsonResponse(res);
}

// Ajoute une adresse à mon profil
async function addMyAddress(data) {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/profile/addresses`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return TokenService.safeJsonResponse(res);
}

// Modifie une de mes adresses
async function updateMyAddress(id, data) {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/profile/addresses/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return TokenService.safeJsonResponse(res);
}

// Supprime une de mes adresses
async function deleteMyAddress(id) {
  await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/profile/addresses/${id}`,
    { method: "DELETE" }
  );
}


/** → ADMIN **/
// Liste **toutes** les adresses du système
async function listAllAddresses() {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/admin/addresses`
  );
  return TokenService.safeJsonResponse(res);
}

// Crée une adresse pour n’importe quel user (admin)
async function addAddressForUser(userId, data) {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/admin/addresses/user/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return TokenService.safeJsonResponse(res);
}

// Modifie n’importe quelle adresse (admin)
async function updateAddress(id, data) {
  const res = await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/admin/addresses/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return TokenService.safeJsonResponse(res);
}

// Supprime n’importe quelle adresse (admin)
async function deleteAddress(id) {
  await TokenService.authFetch(
    `${API_URL}${apiPrefix()}/admin/addresses/${id}`,
    { method: "DELETE" }
  );
}


export { 
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
  listAllAddresses,
  addAddressForUser,
  updateAddress,
  deleteAddress,
};
