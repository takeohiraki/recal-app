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
    recurring_event_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    calendar_owner_user_id: DataTypes.STRING,
    status: DataTypes.STRING,
    creator_email: DataTypes.STRING,
    is_creator: DataTypes.BOOLEAN,
    organizer_email: DataTypes.STRING,
    is_organizer: DataTypes.BOOLEAN,
    event_title: DataTypes.STRING,
    event_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hangoutLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    event_start: {
      type: 'TIMESTAMP'
    },
    event_start_tz: {
      type: 'TIMESTAMP',
      allowNull: true
    },
    event_end: {
      type: 'TIMESTAMP'
    },
    event_end_tz: {
      type: 'TIMESTAMP',
      allowNull: true
    },
    event_original_start: {
      type: 'TIMESTAMP',
      allowNull: true
    },
    event_original_tz: {
      type: 'TIMESTAMP',
      allowNull: true
    },
    event_created_at: {
      type: 'TIMESTAMP'
    },
    event_updated_at: {
      type: 'TIMESTAMP'
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
  calendar_events.associate = function(models) {
    // associations can be defined here
  };
  return calendar_events;
};

