"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("vents", "userId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" }
    });
    await queryInterface.addConstraint("vents", ["id", "userId"], {
      type: "unique",
      name: "vents_unique_id_userId"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("vents", "vents_unique_id_userId");
    await queryInterface.removeColumn("vents", "userId");
  }
};
