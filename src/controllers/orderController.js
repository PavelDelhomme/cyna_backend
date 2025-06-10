const { Order, User, OrderItem, Product, Service, Payment } = require('../models');

exports.listOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'name', 'email']
                },
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
                },
                {
                    model: Payment,
                    as: 'payment'
                }
            ],
            order: [['creationDate', 'DESC']]
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
                },
                {
                    model: Payment,
                    as: 'payment'
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

exports.countOrders = async (req, res) => {
  try {
    const { Order } = require('../models');
    const count = await Order.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.countPendingOrders = async (req, res) => {
  try {
    const { Order } = require('../models');
    const totalPending = await Order.count({
      where: {
        status: [
          'en cours',
          'En attente de confirmation',
          'En attente de paiement',
          'En cours de traitement',
          'En cours de livraison'
        ]
      }
    });
    res.json({ totalPending });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Détail des ventes par produit
exports.productSalesDetails = async (req, res) => {
  try {
    const { sequelize } = require('../models');
    const [results] = await sequelize.query(`
      SELECT
        p.name AS productName,
        COUNT(DISTINCT oip.order_item_id) AS salesCount
      FROM order_item_products oip
      JOIN products p ON oip.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY salesCount DESC;
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Détail des ventes par service
exports.serviceSalesDetails = async (req, res) => {
  try {
    const { sequelize } = require('../models');
    const [results] = await sequelize.query(`
      SELECT
        s.name AS serviceName,
        COUNT(DISTINCT ois.order_item_id) AS salesCount
      FROM order_item_services ois
      JOIN services s ON ois.service_id = s.id
      GROUP BY s.id, s.name
      ORDER BY salesCount DESC;
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.pendingOrders = async (req, res) => {
  try {
    const { Order, User } = require('../models');
    const orders = await Order.findAll({
      where: {
        status: [
          'en cours',
          'En attente de confirmation',
          'En attente de paiement',
          'En cours de traitement',
          'En cours de livraison'
        ]
      },
      include: [{ 
        model: User, 
        as: 'User', 
        attributes: ['id', 'name', 'email'] 
      }],
      order: [['creationDate', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  