const { Order, User, OrderItem, Product, Service } = require('../models');

exports.listOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            as: 'products',
                            through: { attributes: [] }
                        },
                        {
                            model: Service,
                            as: 'services',
                            through: { attributes: [] }
                        }
                    ]
                }
            ]
        });
        res.json(orders);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const orders = await Order.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            as: 'products',
                            through: { attributes: [] }
                        },
                        {
                            model: Service,
                            as: 'services',
                            through: { attributes: [] }
                        }
                    ]
                }
            ]
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: "Aucune commande trouvée pour cet utilisateur" });
        }

        console.log(
            JSON.stringify(
                orders.map(order => ({
                    id: order.id,
                    items: order.OrderItems?.map(item => ({
                        id: item.id,
                        products: item.products,
                        services: item.services
                    }))
                })),
                null,
                2
            )
        );

        res.json(orders);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes de l'utilisateur:", error);
        res.status(500).json({ error: error.message });
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

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: "Order introuvable" });
        }

        await Order.destroy({ where: { id } });
        
        res.json({ message: "Order supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Erreur lors de la suppression de l'order : ", error);
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: "Commande introuvable" });
        }

        await order.update({ status });
        
        res.json(order);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la commande:", error);
        res.status(500).json({ error: error.message });
    }
};