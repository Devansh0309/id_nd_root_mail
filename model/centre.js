// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
  const Centre = sequelize.define("centre", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    centre: { type: DataTypes.STRING, unique: true },
  });

  Centre.associate = (models) => {
    Centre.hasMany(models.UniqueIds, {
      foreignKey: "uniq_id",
    }); //ok
    //add relation with user using user_id
  };
  return Centre;
};
