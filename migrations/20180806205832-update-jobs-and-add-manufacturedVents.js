"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.addColumn("jobs", "id", {
      type: Sequelize.UUID,
      defaultValue: Sequelize.fn("uuid_generate_v4"),
      allowNull: false,
      unique: true
    });
    await queryInterface.addColumn("jobs", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.changeColumn("jobs", "name", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    });
    await queryInterface.addConstraint("jobs", ["id"], {
      type: "primary key",
      name: "jobs_pk"
    });

    await queryInterface.createTable("vents", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      codeHash: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("jobs", "id");
    await queryInterface.dropTable("vents");
  }
};
