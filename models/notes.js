'use strict';
module.exports = (sequelize, DataTypes) => {
  const notes = sequelize.define('notes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    note_text: DataTypes.STRING,
    note_type: DataTypes.STRING,
    user_name: DataTypes.STRING,
    user_id: DataTypes.STRING,
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
  notes.associate = function (models) {
    // associations can be defined here
  };
  return notes;
};