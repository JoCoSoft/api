"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Don't try this at home kids
    await queryInterface.sequelize.query(`DELETE FROM vents;`);
    await queryInterface.addColumn("vents", "serial", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("vents", "serial");
  }
};
