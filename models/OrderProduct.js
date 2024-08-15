import { DataTypes } from 'sequelize';
import sequelize from '../config/Database.js';

const OrderProduct = sequelize.define('OrderProduct', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default OrderProduct;
