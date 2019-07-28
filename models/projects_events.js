'use strict';
module.exports = (sequelize, DataTypes) => {
  const projects_events = sequelize.define('projects_events', {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  projects_events.associate = function (models) {
    // associations can be defined here
  };
  return projects_events;
};