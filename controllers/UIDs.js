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
  } catch (error) {}
};

const generateQRCode = async () => {
  //generateQRCode using UID data, for client. Can be used on client side or server?
};

module.exports = { showUID, createUID };
