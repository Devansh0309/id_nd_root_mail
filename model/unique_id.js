// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
const UniqueIds = sequelize.define("unique_ids", {
  unique_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
});

UniqueIds.associate = (models) => {
  UniqueIds.hasMany(models.Email, {
    foreignKey: "u_id",
  }); //ok
};
return UniqueIds
}
