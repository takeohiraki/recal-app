'use strict';
module.exports = (sequelize, DataTypes) => {
  const calendar_events_attendees = sequelize.define('calendar_events_attendees', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    google_cal_event_id: {
      type: DataTypes.STRING,
    },
    recurring_event_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: DataTypes.STRING,
    display_name: DataTypes.STRING,
    response_status: DataTypes.STRING
  }, {});
  calendar_events_attendees.associate = function(models) {
    // associations can be defined here
  };
  return calendar_events_attendees;
};