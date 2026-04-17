const { Sequelize, DataTypes } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
// console.log({
//   DB_USER: process.env.app_user,
//   DB_PASS: process.env.db_pass,
//   DB_HOST: process.env.host
// });
const sequelize = new Sequelize(process.env.db, process.env.app_user, process.env.db_pass, {
  host: process.env.host,
  dialect: 'mysql'
});

const Email = require("../model/email")
const UniqueIds = require("../model/unique_id");
const Users = require("../model/users")
const Centre = require("../model/centre")
const EmailOTP = require("../model/otp")

async function connectToDB() {
  try {
    await sequelize?.authenticate();
    console.log("Connection has been established successfully.");
    console.log("Models:", Object.keys(sequelize.models));
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    // return false
  }
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Email = Email(sequelize, DataTypes)
db.UniqueIds = UniqueIds(sequelize, DataTypes)
db.Users = Users(sequelize, DataTypes)
db.Centre = Centre(sequelize, DataTypes)
db.EmailOTP = EmailOTP(sequelize, DataTypes)

Object.keys(db).forEach((modelName) => {
  if ( db[modelName].associate && typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

db.sequelize.sync({ alter: false }).then(() => {
  console.log("Yes re-sync done");
});

module.exports ={connectToDB, db}