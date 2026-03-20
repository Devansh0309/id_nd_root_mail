const { db } = require("../database/db");
const EmailModel = db.Email;

//use Authentication, authorization middleware, main concern is uid
const isRootMail = async (req, res, next) => {
  const mailId = req.query.email;
  try {
    if (!mailId) {
      return res.status(400).json({
        status: "fail",
        msg: `MailId: not present!`,
      });
    }
    const checkIsRootMail = await EmailModel.findOne({
      attributes: ["root_mail"],
      where: {
        email: mailId,
      },
      raw:true
    });
    console.log({checkIsRootMail})
    if (checkIsRootMail && checkIsRootMail.email) {
      return res.status(200).json({
        status: "success",
        data: checkIsRootMail,
      });
    }
    return res.status(200).json({
      status: "success",
      msg: `RootMail not found by mailId: ${mailId}`,
    });
  } catch (error) {
    console.error(err);
    throw new Error();
  }
};

const verifyMail = async (req, res, next) => {
  try {
    //send otp on mail for mail verification use NodeMailer or other service.
  } catch (error) {}
};

module.exports = { isRootMail, verifyMail };
