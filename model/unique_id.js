// const {db} = require("../database/db");
module.exports = (sequelize, DataTypes) => {
  const UniqueIds = sequelize.define(
    "unique_ids",
    {
      uid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      unique_id: {
        type: DataTypes.STRING(8),
        allowNull: true,
        unique: true,
      },
      course_type: {
        type: DataTypes.ENUM,
        values: [
          "ST",
          "10days",
          "20days",
          "30days",
          "45days",
          "60days",
          "10days special",
        ],
      }, //to add
      course_number: { type: DataTypes.INTEGER, allowNull: true }, //either this or dat of course, to add
      centre_id: { type: DataTypes.INTEGER, allowNull: false }, //to add
      course_start_date: { type: DataTypes.DATE, allowNull: false }, //to add
      seat_number: { type: DataTypes.INTEGER, allowNull: false }, //to add
      user_id: { type: DataTypes.INTEGER }, //to add
    },
    {
      indexes: [
        {
          unique: true,
          fields: [
            "centre_id",
            "course_type",
            "course_start_date",
            "seat_number",
          ],
        },
      ],
    },
  );
  console.log("Before associate:", Object.keys(UniqueIds.rawAttributes));

  UniqueIds.associate = (models) => {
    // UniqueIds.hasMany(models.Email, {
    //   foreignKey: "uniq_id",
    // }); //ok
    UniqueIds.belongsTo(models.Centre, {
      foreignKey: "centre_id",
    }); //ok
    //add relation with user using user_id
    UniqueIds.belongsTo(models.Users, {
      foreignKey: "user_id",
    });
    console.log("After hasMany:", Object.keys(UniqueIds.rawAttributes));
    // delete UniqueIds.rawAttributes.uniq_id;
    // UniqueIds.refreshAttributes();
  };

  // UniqueIds?.afterCreate(async (uniq_id) => {
  //   const uniqueId = "C" + uniq_id.uid.toString(36).padStart(7, "0");

  //   await uniq_id.update({ unique_id: uniqueId });
  // });
  return UniqueIds;
};
