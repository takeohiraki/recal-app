'use strict';
module.exports = (sequelize, DataTypes) => {
  const slack_message = sequelize.define('slack_message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message_text: DataTypes.STRING,
    user_name: DataTypes.STRING,
    command: DataTypes.STRING,
    slack_user_id: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  slack_message.associate = function (models) {
    // associations can be defined here
  };
  return slack_message;
};