"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP WITHOUT TIME ZONE",
        defaultValue: queryInterface.sequelize.fn("NOW")
      }
    });
    await queryInterface.createTable("passwords", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      password: { type: Sequelize.STRING, allowNull: false },
      userId: {
        type: Sequelize.UUID,
        references: { model: "users", key: "id" }
      },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP WITHOUT TIME ZONE",
        defaultValue: queryInterface.sequelize.fn("NOW")
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("passwords");
    await queryInterface.dropTable("users");
  }
};
