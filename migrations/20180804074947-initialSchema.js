"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("jobs", {
      name: Sequelize.STRING,
      data: Sequelize.JSON
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("jobs");
  }
};
