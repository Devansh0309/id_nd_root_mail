const { db } = require("../database/db");
const EmailModel = db.Email;
const UIDModel = db.UniqueIds;

const uidExistsForMail = async (req, res, next) => {
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
    if (getUID && getUID.email && !getUID.uniq_id) {
    //   return res.status(200).json({
    //     status: "success",
    //     data: getUID,
    //   });
    }
    else if (getUID && getUID.email && getUID.uniq_id) {
    //   return res.status(200).json({
    //     status: "success",
    //     data: getUID,
    //   });
    }
    return res.status(200).json({
      status: "success",
      msg: `Either RootMail or UID not found by mailId: ${mailId}`,
    });
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      msg: `Cannot check for RootMail & UID by mailId: ${mailId}`,
    });
    // throw new Error();
  }
};

module.exports = uidExistsForMail