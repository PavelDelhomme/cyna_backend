const { 
    User, UserProfile, Product, Service, Payment, Ticket, Role,
    Order, Cart, PromoCode, Review, Stat, ServiceType, 
    ProductCategory, Address, Invoice, Chatbot, ChatbotHistory, AddressUserProfile
} = require('../models');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'role'
      }]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.listRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listProfiles = async (req, res) => {
    const profiles = await UserProfile.findAll();
    res.json(profiles);
};

exports.listProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};

exports.listServices = async (req, res) => {
    const services = await Service.findAll();
    res.json(services);
};

exports.listPayments = async (req, res) => {
    const payments = await Payment.findAll();
    res.json(payments);
};

exports.listTickets = async (req, res) => {
    const tickets = await Ticket.findAll();
    res.json(tickets);
};

exports.listOrders = async (req, res) => {
    const orders = await Order.findAll();
    res.json(orders);
};

exports.listCarts = async (req, res) => {
    const carts = await Cart.findAll();
    res.json(carts);
};

exports.listPromoCodes = async (req, res) => {
    const promoCodes = await PromoCode.findAll();
    res.json(promoCodes);
};

exports.listReviews = async (req, res) => {
    const reviews = await Review.findAll();
    res.json(reviews);
};

exports.listStats = async (req, res) => {
    const stats = await Stat.findAll();
    res.json(stats);
};

exports.listServiceTypes = async (req, res) => {
    const serviceTypes = await ServiceType.findAll();
    res.json(serviceTypes);
};

exports.listProductCategories = async (req, res) => {
    const categories = await ProductCategory.findAll();
    res.json(categories);
};

exports.listAddresses = async (req, res) => {
    const addresses = await Address.findAll();
    res.json(addresses);
};

exports.listInvoices = async (req, res) => {
    const invoices = await Invoice.findAll();
    res.json(invoices);
};

exports.listChatbots = async (req, res) => {
    const chatbots = await Chatbot.findAll();
    res.json(chatbots);
};

exports.listChatbotHistories = async (req, res) => {
    const histories = await ChatbotHistory.findAll();
    res.json(histories);
};


// Ajouter une adresse à un utilisateur spécifique
exports.createAddressForUser = async (req, res) => {
    const { address1, city, postalCode, region, country, type} = req.body;
    const { userId } = req.params;

    try {
        const userProfile = await UserProfile.findOne({ where: { user_id: userId } });
        if (!userProfile) {
            return res.status(404).json({ error: "Profil utilisateur introuvable" });
        }

        const address = await Address.create({ address1, city, postalCode, region, country, type });

        await AddressUserProfile.create({
            address_id: address.id,
            user_profile_id: userProfile.id
          });
        res.status(201).json({ message: "Adresse créée pour l'utilisateur", address });      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Modifier une adresse par ID (admin)
exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const { address1, city, postalCode, region, country, type } = req.body;

    try {
        const address = await Address.findByPk(id);
        if (!address) {
        return res.status(404).json({ error: "Adresse introuvable" });
        }

        await address.update({ address1, city, postalCode, region, country, type });

        res.json({ message: "Adresse mise à jour", address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
// Supprimer une adresse par ID (admin)
exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
  
    try {
      const address = await Address.findByPk(id);
      if (!address) {
        return res.status(404).json({ error: "Adresse introuvable" });
      }
  
      // Supprimer l'association
      await AddressUserProfile.destroy({ where: { address_id: id } });
  
      // Supprimer l'adresse
      await Address.destroy({ where: { id } });
  
      res.json({ message: "Adresse supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


exports.listUserTokens = async (req, res) => {
    const users = await User.findAll({ include: Role });
    const jwt = require("jsonwebtoken");
    const tokens = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role?.name || 'N/A',
      token: jwt.sign({ userId: u.id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    }));
    res.json(tokens);
};


// Obtention de toutes les adresses liés a un utilisateur (via son profil)
exports.getUserAddresses = async (req, res) => {
    const { userId } = req.params;
    try {
        const userProfile = await UserProfile.findOne({ where: { user_id: userId } });
        if (!userProfile) {
        return res.status(404).json({ error: "Profil utilisateur introuvable" });
        }

        const addresses = await Address.findAll({
        include: [{
            model: AddressUserProfile,
            where: { user_profile_id: userProfile.id }
        }]
        });

        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Attribuer un rôle à un utilisateur (admin uniquement)
exports.assignRoleToUser = async (req, res) => {
    const { userId } = req.params;
    const { roleId } = req.body;
  
    try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
  
      const role = await require('../models').Role.findByPk(roleId);
      if (!role) return res.status(404).json({ error: "Rôle introuvable" });
  
      user.role_id = roleId;
      await user.save();
  
      res.json({ message: "Rôle attribué avec succès", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.createTicket = async (req, res) => {
    try {
      const { subject, description, user_id } = req.body;
      const ticket = await Ticket.create({ subject, description, user_id });
      res.status(201).json(ticket);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  
  exports.createPayment = async (req, res) => {
    try {
      const { amount, status, user_id } = req.body;
      const payment = await Payment.create({ amount, status, user_id });
      res.status(201).json(payment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.createOrder = async (req, res) => {
    try {
      const { user_id, totalPrice, status } = req.body;
      const order = await Order.create({ user_id, totalPrice, status });
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.createCart = async (req, res) => {
    try {
      const { user_id, items, total } = req.body;
      const cart = await Cart.create({ user_id, items, total });
      res.status(201).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.createPromoCode = async (req, res) => {
    try {
      const { code, discount, expiresAt } = req.body;
      const promo = await PromoCode.create({ code, discount, expiresAt });
      res.status(201).json(promo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.createReview = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const userId = req.user.id;

      if (!rating || !comment) {
        return res.status(400).json({ error: "Note et commentaire requis." });
      }
      
      const review = await Review.create({
        user_id: userId,
        rating,
        comment,
        reviewDate: new Date()
      });

      res.status(201).json(review);
    } catch (err) {
      console.error("Erreur création review :", err);
      res.status(500).json({ error: err.message });
    }
  };

  exports.createStat = async (req, res) => {
    try {
      const { key, value } = req.body;
      const stat = await Stat.create({ key, value });
      res.status(201).json(stat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.assignPromoToProduct = async (req, res) => {
    const { PromoCode, Product } = require('../models');
    const { promoId, productId } = req.params;
    try {
      const promo = await PromoCode.findByPk(promoId);
      const product = await Product.findByPk(productId);
      if (!promo || !product) return res.status(404).json({ error: "Promo ou produit non trouvé." });
  
      await product.update({ promo_code_id: promo.id });
      res.json({ message: "Code promo appliqué au produit." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.assignPromoToService = async (req, res) => {
    const { promoId, serviceId } = req.params;
    try {
      const promo = await PromoCode.findByPk(promoId);
      const service = await Service.findByPk(serviceId);
      if (!promo || !service) return res.status(404).json({ error: "Promo ou service non trouvé." });
  
      await service.update({ promo_code_id: promo.id });
      res.json({ message: "Code promo appliqué au service." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.assignPromoToProductCategory = async (req, res) => {
    const { promoId, categoryId } = req.params;
    try {
      const promo = await PromoCode.findByPk(promoId);
      const category = await ProductCategory.findByPk(categoryId);
      if (!promo || !category) return res.status(404).json({ error: "Promo ou catégorie non trouvée." });
  
      await category.update({ promo_code_id: promo.id });
      res.json({ message: "Code promo appliqué à la catégorie." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.createCartForUser = async (req, res) => {
    const { userId } = req.params;
    try {
      const cart = await Cart.create({ user_id: userId, items: [], total: 0 });
      res.status(201).json({ message: "Panier créé pour l'utilisateur", cart });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.addProductToCart = async (req, res) => {
    const { cartId, productId } = req.params;
    try {
      const cart = await Cart.findByPk(cartId);
      const product = await Product.findByPk(productId);
      if (!cart || !product) return res.status(404).json({ error: "Panier ou produit introuvable" });
  
      const items = cart.items || [];
      items.push({ type: 'product', id: product.id, name: product.name, price: product.price });
      const total = items.reduce((sum, item) => sum + item.price, 0);
      await cart.update({ items, total });
  
      res.json({ message: "Produit ajouté au panier", cart });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.addServiceToCart = async (req, res) => {
    const { cartId, serviceId } = req.params;
    try {
      const cart = await Cart.findByPk(cartId);
      const service = await Service.findByPk(serviceId);
      if (!cart || !service) return res.status(404).json({ error: "Panier ou service introuvable" });
  
      const items = cart.items || [];
      items.push({ type: 'service', id: service.id, name: service.name, price: service.price });
      const total = items.reduce((sum, item) => sum + item.price, 0);
      await cart.update({ items, total });
  
      res.json({ message: "Service ajouté au panier", cart });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  // Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, promotion, category_id } = req.body;

    if (!name || !price || !stock || !category_id) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      promotion,
      category_id
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Créer un service
exports.createService = async (req, res) => {
  try {
    const {
      name, description, price, status, subscription,
      subscriptionType, userCount, promotion, service_type_id
    } = req.body;

    if (!name || !price || !service_type_id) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    const service = await Service.create({
      name,
      description,
      price,
      status,
      subscription,
      subscriptionType,
      userCount,
      promotion,
      service_type_id
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [role] = await Role.findOrCreate({ where: { name: 'user' } });
    const user = await User.create({ name, email, password, role_id: role.id });
    await UserProfile.create({ user_id: user.id });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("[devController.js] Erreur lors de la création de l'utilisateur : ", e);
  }
};


exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      console.error("[devController.js] Rôle non trouvé");
      return res.status(404).json({ error: "Rôle non trouvé" });
    };
    await role.destroy();
    res.json({ message: "Rôle supprimé" });
    console.log("[devController.js] Rôle supprimé");
  } catch (err) {
    console.error("[devController.js] Erreur lors de la suppression du rôle", err);
    res.status(500).json({ error: err.message });
  }
};


exports.fixProfiles = async (req, res) => {
  try {
    const users = await User.findAll();
    const created = [];
    for (const user of users) {
      const [profile, isNew] = await UserProfile.findOrCreate({ where: { user_id: user.id } });
      if (isNew) created.push(user.email);
    }
    res.json({ message: "Profils vérifiés/Créés", newlyCreated: created});
  } catch (error) {
    console.error("[devController.js] Erreur lors de la tentative de fix de profiles", error);
    res.status(500).json({ error: error.message });
  }
};

exports.resetUsers = async (req, res) => {
  try {
    const adminUser = await User.findOne({ where: { email: 'admin@cyna.dev' } });
    if (!adminUser) return res.status(404).json({ error: "Admin introuvable." });

    await UserProfile.destroy({ where: { user_id: { [require('sequelize').Op.ne]: adminUser.id } } });
    await User.destroy({ where: { id: { [require('sequelize').Op.ne]: adminUser.id } } });

    res.json({ message: "Tous les utilisateurs (sauf admin) supprimés." });
  } catch (error) {
    console.error("[devController.js] Erreur lors du reset ", error);
    res.status(500).json({ error: "Erreur lors du reset" });
  }
};


exports.createAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ where: { email: 'admin@cyna.dev' } });
    if (!admin) return res.status(404).json({ error: 'Admin introuvable' });

    const [profile, created] = await UserProfile.findOrCreate({ where: { user_id: admin.id } });
    res.json({ message: created ? "Profil admin créé" : "Profil déjà existant", profile });
  } catch (err) {
    console.error("[devController.js] Erreur lors de la tentative de création du profil pour l'administrateur", error);
    res.status(500).json({ error: err.message });
  }
};