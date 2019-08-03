'use strict';
module.exports = (sequelize, DataTypes) => {
  const calendar_events = sequelize.define('calendar_events', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    google_cal_event_id: {
      type: DataTypes.STRING,
      unique: true
    },
    user_id: DataTypes.STRING,
    google_cal_user_id: DataTypes.STRING,
    creator_id: DataTypes.STRING,
    html_link: DataTypes.STRING,
    i_cal_uid: DataTypes.STRING,
    organizer_email: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    event_title: DataTypes.STRING,
    event_description: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    repeat_event: DataTypes.BOOLEAN,
    repeat_event_parent_id: DataTypes.STRING
    
  }, {});
  calendar_events.associate = function(models) {
    // associations can be defined here
  };
  return calendar_events;
};

