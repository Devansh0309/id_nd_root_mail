const { db } = require("../database/db");
const UIDModel = db.UniqueIds;
const EmailModel = db.Email;

//use Authentication, authorization middleware, main concern is uid
const showUID = async (req, res, next) => {
  const mailId = req.query.email;
  try {
    if (!mailId) {
      return res.status(400).json({
        status: "fail",
        msg: `MailId: not present!`,
      });
    }
    const getUID = await EmailModel.findOne({
      where: {
        email: mailId,
      },
      raw: true,
    });
    if (getUID && getUID.email && getUID.u_id) {
      return res.status(200).json({
        status: "success",
        data: getUID,
      });
    }
    return res.status(200).json({
      status: "success",
      msg: `Either RootMail or UID not found by mailId: ${mailId}`,
    });
  } catch (error) {
    console.error(err);
    throw new Error();
  }
};

const createUID = async (req, res, next) => {
  const { seat_number, course_type, course_number, email } = req.body;
  try {
    if (!seat_number) {
      return res.status(400).json({
        status: "fail",
        msg: `Seat number not present!`,
      });
    }
    if (!course_type || !["a"].includes(course_type)) {
      return res.status(400).json({
        status: "fail",
        msg: `Either course type not present or invalid course type!`,
      });
    }
    if (
      !course_number ||
      Number.isNaN(course_number) ||
      Number.parseInt(course_number) ||
      course_number < 1
    ) {
      return res.status(400).json({
        status: "fail",
        msg: `Either course number not present or invalid course number!`,
      });
    }
    if (!email) {
      return res.status(400).json({
        status: "fail",
        msg: `Email not present!`,
      });
    }

    //*What type of id to use for uid which saves space, fits well with max users, avoids collision?
  } catch (error) {}
};

// async function generateUID(lastKey) {
//   let last_key = lastKey
//   const transaction = await db?.sequelize.transaction();
//   console.log({
//     last_key
//   });
//   try {

//     let newPrimaryKey;

//     // Fetch the last key only if lastKey is null
//     if (!last_key) {
//       console.log("Fetching last record from database...");
//       const lastRecord = await productItemBids?.findOne({
//         order: [["id", "DESC"]],
//         lock: transaction?.LOCK?.UPDATE,
//         transaction,
//       });

//       if (lastRecord) {
//         last_key = lastRecord.id;
//         console.log("Fetched lastKey from database:", last_key);
//       } else {
//         // No records found, initialize lastKey
//         last_key = "00004"; // Adjust this to your desired starting value
//         console.log("No record found, initializing lastKey:", last_key);
//       }
//     }

//     // Generate new primary key based on lastKey
//     newPrimaryKey = (parseInt(lastestKey, 36) + 1)
//       .toString(36)
//       .toUpperCase()
//       .padStart(5, "0");

//     // Check for overflow condition and reset to 6 characters if needed
//     if (newPrimaryKey?.length > 5) {
//       newPrimaryKey = "000001"; // Transition to 6 characters
//       console.log("Overflow occurred. Resetting newPrimaryKey to:", newPrimaryKey);
//     }

//     // Update lastKey with the newly generated primary key
//     lastestKey = newPrimaryKey;
//     console.log("Updated lastKey to:", lastestKey);

//     await transaction?.commit();
//     return {newPrimaryKey, lastK:lastestKey};
//   } catch (error) {
//     await transaction?.rollback();
//     console.error("Error generating primary key:", error);
//     throw  new error;
//   }
// }

const generateQRCode = async () => {
  //generateQRCode using UID data, for client. Can be used on client side or server?
};

module.exports = { showUID, createUID };
