// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
const Users = sequelize.define("user", {
  name: DataTypes.STRING,
  phone_number: DataTypes.INTEGER
});

Users.associate = (models) => {
 //add relation, user has many mails
};
return Users
}
