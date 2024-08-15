import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/Database.js';

const Product = db.define('Product', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  discountPercentage: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Tag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Taille: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true
});

export default Product;
