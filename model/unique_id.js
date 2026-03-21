// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
const UniqueIds = sequelize.define("unique_ids", {
  unique_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  course_type:{}, //to add
  course_number:{}, //to add
  centre:{}, //to add
  course_start_date:{}, //to add
  seat_number:{} //to add
});

UniqueIds.associate = (models) => {
  UniqueIds.hasMany(models.Email, {
    foreignKey: "u_id",
  }); //ok
};
return UniqueIds
}
