// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
  const EmailOTP = sequelize.define("emailOTP", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  });

  return EmailOTP;
};
