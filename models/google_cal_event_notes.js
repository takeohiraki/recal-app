'use strict';
module.exports = (sequelize, DataTypes) => {
  const google_cal_event_notes = sequelize.define('google_cal_event_notes', {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    note_id: {
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
  google_cal_event_notes.associate = function (models) {
    // associations can be defined here
  };
  return google_cal_event_notes;
};