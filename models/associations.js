import Order from './order.js';
import OrderProduct from './OrderProduct.js';

Order.hasMany(OrderProduct, { foreignKey: 'orderId', as: 'orderProducts' });
OrderProduct.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

export { Order, OrderProduct };
