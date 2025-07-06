const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./User');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'categories',
  timestamps: false
});

// Define association
User.hasMany(Category, { foreignKey: 'user_id' });
Category.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Category;
