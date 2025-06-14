'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('principles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text_ru: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      text_en: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      text_am: {
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
    await queryInterface.dropTable('principles');
  },
};