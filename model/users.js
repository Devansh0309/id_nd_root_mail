// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("user", {
    name: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
  });

  Users.associate = (models) => {
    //add relation, user has many mails, & with many uids
    Users.hasMany(models.Email, {
      foreignKey: "user_id",
    });
    Users.hasMany(models.UniqueIds, {
      foreignKey: "user_id",
    });
  };
  return Users;
};
