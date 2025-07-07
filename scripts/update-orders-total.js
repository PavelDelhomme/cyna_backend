const fs = require('fs').promises;
const path = require('path');

async function updateOrdersTotal() {
  const basePath = path.join(__dirname, '../src/data');
  const orders = JSON.parse(await fs.readFile(path.join(basePath, 'orders.json'), 'utf8'));
  const orderItems = JSON.parse(await fs.readFile(path.join(basePath, 'orderItems.json'), 'utf8'));
  const assoProducts = JSON.parse(await fs.readFile(path.join(basePath, 'assoOrderItemsProducts.json'), 'utf8'));
  const assoServices = JSON.parse(await fs.readFile(path.join(basePath, 'assoOrderItemsServices.json'), 'utf8'));
  const products = JSON.parse(await fs.readFile(path.join(basePath, 'products.json'), 'utf8'));
  const services = JSON.parse(await fs.readFile(path.join(basePath, 'services.json'), 'utf8'));

  // Création de maps pour accès rapide
  const productMap = Object.fromEntries(products.map(p => [p.id, p.price]));
  const serviceMap = Object.fromEntries(services.map(s => [s.id, s.price]));

  // Associations order_item_id -> product_id/service_id
  const orderItemToProduct = Object.fromEntries(assoProducts.map(a => [a.order_item_id, a.product_id]));
  const orderItemToService = Object.fromEntries(assoServices.map(a => [a.order_item_id, a.service_id]));

  // Calcul du total pour chaque commande
  for (const order of orders) {
    const items = orderItems.filter(oi => oi.order_id === order.id);
    let total = 0;
    for (const item of items) {
      let price = 0;
      if (orderItemToProduct[item.id]) {
        price = productMap[orderItemToProduct[item.id]] || 0;
      } else if (orderItemToService[item.id]) {
        price = serviceMap[orderItemToService[item.id]] || 0;
      }
      total += price * item.Quantity;
    }
    order.totalprice = total;
  }

  await fs.writeFile(path.join(basePath, 'orders.json'), JSON.stringify(orders, null, 2));
  console.log('orders.json mis à jour avec les bons totaux !');
}

updateOrdersTotal();
