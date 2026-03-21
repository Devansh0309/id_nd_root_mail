// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
  const UniqueIds = sequelize.define("unique_ids", {
    unique_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    course_type: {
      type: DataTypes.ENUM,
      values: ["ST", "10days", "20days", "30days", "45days", "60days", "10days special"],
    }, //to add
    course_number: { type: DataTypes.INTEGER, allowNull: true }, //either this or dat of course, to add
    centre: { type: DataTypes.STRING, allowNull: false}, //to add
    course_start_date: { type: DataTypes.DATE, allowNull: false }, //to add
    seat_number: { type: DataTypes.INTEGER, allowNull: false}, //to add
  });

  UniqueIds.associate = (models) => {
    UniqueIds.hasMany(models.Email, {
      foreignKey: "u_id",
    }); //ok
  };
  return UniqueIds;
};
