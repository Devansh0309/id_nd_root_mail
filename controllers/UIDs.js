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
      raw:true
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
  try {
  } catch (error) {}
};

const generateQRCode = async()=>{
    //generateQRCode using UID data, for client. Can be used on client side or server?
}

module.exports = { showUID, createUID };
