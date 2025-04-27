const { 
    User, UserProfile, Product, Service, Payment, Ticket, 
    Order, Cart, PromoCode, Review, Stat, ServiceType, 
    ProductCategory, Address, Invoice, Chatbot, ChatbotHistory, AddressUserProfile
} = require('../models');

exports.listUsers = async (req, res) => {
    const users = await User.findAll({ include: ['role'] });
    res.json(users);
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