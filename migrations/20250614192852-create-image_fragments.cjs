'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('image_fragments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      subject: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      setting: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('image_fragments');
  },
};