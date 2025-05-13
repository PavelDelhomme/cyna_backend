const { Cart, Service, Product } = require('../models');

exports.listCarts = async (req, res) => {
    const carts = await Cart.findAll();
    res.json(carts);
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

exports.updateCartForUser = async (req, res) => {
    try {
        const cart = await Cart.findByPk(req.params.id);

        if (!cart) {
            return res.status(404).json({ error: "Cart non trouvé"});
        }
        
        await cart.update(req.body);

        res.json({ message: "Cart mis à jour", cart });
    } catch (error) {
        console.error("[cartController.js] Erreur updateCart", error);
        res.status(500).json({ error: error.message });
    }
};



exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findByPk(req.params.id);

        if (!cart) {
            return res.status(404).json({ error: "Cart inexistant" });
        }

  
        await cart.destroy();

        res.json({ message: "Cart supprimé" });
    } catch (error) {
        console.error("[cartController.js Erreur deleteCart", error);
        res.status(500).json({ error: error.message });
    }
}