import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/Database.js';
import Product from './product.js';

const ProductImage = sequelize.define('ProductImage', {
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  }
}, {
  freezeTableName: true
});

Product.hasMany(ProductImage, { foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

export default ProductImage;
