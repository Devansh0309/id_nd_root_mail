// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
const Email = sequelize.define("email", {
  email: DataTypes.STRING,
  root_mail: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  },
  u_id: { type: DataTypes.INTEGER, allowNull: false },
});

Email.associate = (models) => {
  Email.belongsTo(models.UniqueIds, {
    foreignKey: "u_id",
  }); //ok
};
return Email
}
