'use strict';
module.exports = (sequelize, DataTypes) => {
  const google_cal_events = sequelize.define('google_cal_events', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    creator: DataTypes.STRING,
    html_link: DataTypes.STRING,
    i_cal_uid: DataTypes.STRING,
    google_cal_event_id: {
      type: DataTypes.STRING,
      unique: true
    },
    organizer_email: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    description: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    user_id: DataTypes.STRING
  }, {});
  google_cal_events.associate = function(models) {
    // associations can be defined here
  };
  return google_cal_events;
};
