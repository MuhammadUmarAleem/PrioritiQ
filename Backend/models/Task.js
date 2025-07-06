const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./User');
const Category = require('./Category');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Task, { foreignKey: 'category_id' });
Task.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Task;
