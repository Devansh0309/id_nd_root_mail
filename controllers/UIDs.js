const { db } = require("../database/db");
const UIDModel = db.UniqueIds;
const EmailModel = db.Email;
const CentreModel = db.Centre;
const { Op } = db.sequelize;

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
      include: {
        model: UIDModel,
        attributes: ["unique_id"],
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
  const {
    centre_id,
    course_start_date,
    seat_number,
    course_type,
    course_number,
    email,
  } = req.body;
  try {
    if (!centre_id || Number.isNaN(centre_id) || Number.parseInt(centre_id)) {
      return res.status(400).json({
        status: "fail",
        msg: `Centre id not present or not an integer!`,
      });
    }
    if (
      !course_type ||
      ![
        "ST",
        "10days",
        "20days",
        "30days",
        "45days",
        "60days",
        "10days special",
      ].includes(course_type)
    ) {
      return res.status(400).json({
        status: "fail",
        msg: `Either course type not present or invalid course type!`,
      });
    }
    if (
      !course_start_date &&
      (!course_number ||
        Number.isNaN(course_number) ||
        Number.parseInt(course_number) ||
        course_number < 1)
    ) {
      return res.status(400).json({
        status: "fail",
        msg: `Either course number not present or invalid course number!`,
      });
    } else if (
      course_start_date &&
      course_start_date instanceof Date &&
      !isNaN(course_start_date)
    ) {
      return res.status(400).json({
        status: "fail",
        msg: `Either course_start_date not present or invalid course_start_date!`,
      });
    } else if (!course_start_date && !course_number) {
      return res.status(400).json({
        status: "fail",
        msg: `Neither course_start_date nor course number are present!`,
      });
    }
    if (!email) {
      return res.status(400).json({
        status: "fail",
        msg: `Email not present!`,
      });
    }
    if (!seat_number) {
      return res.status(400).json({
        status: "fail",
        msg: `Seat number not present!`,
      });
    }

    const isValidCentreId = await CentreModel.findOne({
      raw: true,
      where: {
        id: centre_id,
      },
      attributes: ["centre"],
    });
    //*can also validate that given details in payload like course start date, centre id, course type, seat number align with info form the Vipassana centre, meaning it is not fictional. Also can add that seat number belongs with the user who is hitting api or making createuid request
    //also check if the user hitting api of createuid has some uid existing or not, check date of creation, if it is created within one month don't create, else create new one.
    if (isValidCentreId && isValidCentreId.centre) {
      // create entry/row for uid, unique_id will be automatically created
      const [uniq_id, created] = await UIDModel.findOrCreate({
        where: {
          course_type,
          centre_id,
          [Op.or]: [{ course_start_date }, { course_number }],
          seat_number,
        },
        defaults: {
          centre_id,
          course_start_date,
          seat_number,
          course_type,
          course_number,
        },
      });
      //*What type of id to use for uid which saves space, fits well with max users, avoids collision?
      if (created) {
        return res.status(200).json({
          status: "success",
          msg: `Entry for uniq_id created!`,
          unique_id: uniq_id.unique_id
        });
      } else if (uniq_id && !created) {
        return res.status(200).json({
          status: "fail",
          msg: `Entry for uniq_id already exists!`,
          unique_id: uniq_id.unique_id
        });
      }
      return res.status(500).json({
        status: "fail",
        msg: `Neither Entry for uniq_id created nor found!`,
      });
    }
    return res.status(400).json({
      status: "fail",
      msg: `Centre id not valid!`,
    });
  } catch (error) {
    console.error(err);
    throw new Error();
  }
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
