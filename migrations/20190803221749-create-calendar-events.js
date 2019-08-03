'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('calendar_events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      google_cal_event_id: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.STRING
      },
      google_cal_user_id: {
        type: Sequelize.STRING
      },
      creator_id: {
        type: Sequelize.STRING
      },
      html_link: {
        type: Sequelize.STRING
      },
      i_cal_uid: {
        type: Sequelize.STRING
      },
      organizer_email: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      event_title: {
        type: Sequelize.STRING
      },
      event_description: {
        type: Sequelize.STRING
      },
      repeat_event: {
        type: Sequelize.BOOLEAN
      },
      repeat_event_parent_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('calendar_events');
  }
};