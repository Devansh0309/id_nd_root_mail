const { db } = require("../database/db");
const UIDModel = db.UniqueIds;
const EmailModel = db.Email;
const CentreModel = db.Centre;
const { Op } = require("sequelize");

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
        raw: true,
      },
      raw: true,
      nest: true,
    });
    if (getUID && getUID.email && getUID.uniq_id) {
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
  //add self mail as root mail if uid exists by details used to check uid exists before creating.
  let centre_id = req.centre_id;
  let { course_start_date, seat_number, course_type, course_number, email } =
    req.query;
  // centre_id = parseInt(centre_id);
  course_number = parseInt(course_number);
  course_start_date = new Date(course_start_date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  console.log({
    centre_id,
    course_start_date,
    seat_number,
    course_type,
    course_number,
    email,
  });
  const t = await db.sequelize.transaction();

  try {
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
        !Number.parseInt(course_number) ||
        course_number < 1)
    ) {
      return res.status(400).json({
        status: "fail",
        msg: `Either course number not present or invalid course number!`,
      });
    }
    //  else if (
    //   course_start_date &&
    //   isNaN(course_start_date) &&
    //   (!course_start_date) instanceof Date
    // ) {
    //   return res.status(400).json({
    //     status: "fail",
    //     msg: `Either course_start_date not present or invalid course_start_date!`,
    //   });
    // }
    else if (!course_start_date && !course_number) {
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
    //*can also validate that given details in payload like course start date, centre id, course type, seat number align with info form the Vipassana centre, meaning it is not fictional. Also can add that seat number belongs with the user who is hitting api or making createuid request
    //also check if the user hitting api of createuid has some uid existing or not, check date of creation, if it is created within one month don't create, else create new one.
    // if (isValidCentreId && isValidCentreId.centre) {
    console.log(Object.keys(UIDModel.rawAttributes));
    // create entry/row for uid, unique_id will be automatically created
    const existing = await UIDModel.findOne({
      where: {
        course_type,
        centre_id,
        [Op.or]: [{ course_start_date }, { course_number }],
        seat_number,
      },
      attributes: { exclude: ["uniq_id"] },
      raw: true,
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    let uniq_id,
      created = false;

    if (existing) {
      uniq_id = existing;
      console.log({uniq_id, created})
    } else {
      uniq_id = await UIDModel.create(
        {
          centre_id,
          course_start_date,
          seat_number,
          course_type,
          course_number,
        },
        { attributes: { exclude: ["uniq_id"] }, transaction: t },
      );
      created = true;
      console.log({uniq_id, created})
    }

    //*What type of id to use for uid which saves space, fits well with max users, avoids collision?
    if (created && !uniq_id.unique_id) {
      const uniqueId = "C" + uniq_id.uid.toString(36).padStart(7, "0");

      const [affectedRows] = await UIDModel.update(
        { unique_id: uniqueId },
        { where: { uid: uniq_id.uid }, transaction: t },
      );

      uniq_id.unique_id = uniqueId;
      if (affectedRows) {
        await t.commit();
        return res.status(200).json({
          status: "success",
          msg: `Entry for uniq_id created!`,
          unique_id: uniq_id.unique_id,
          unique_id_ref: uniq_id.uid
        });
      }
      const record = await UIDModel.findOne({
        where: { uid: uniq_id.uid },
      });

      if (!record) {
        await t.rollback();
        return res.status(500).json({
          status: "fail",
          msg: `Record not found!`,
        });
      }
      await t.rollback();
      return res.status(500).json({
        status: "fail",
        msg: `Record unchanged for uid`,
      });
    } else if (uniq_id && !created) {
      await t.commit();
      return res.status(200).json({
        status: "success",
        msg: `Entry for uniq_id already exists!`,
        unique_id: uniq_id.unique_id,
        unique_id_ref: uniq_id.uid
      });
    }
    await t.rollback();
    return res.status(500).json({
      status: "fail",
      msg: `Neither Entry for uniq_id created nor found!`,
    });
    // }
    // return res.status(400).json({
    //   status: "fail",
    //   msg: `Centre id not valid!`,
    // });
  } catch (err) {
    await t.rollback();
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
