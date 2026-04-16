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
    console.log({getUID});
    
    if (getUID && getUID.email && !getUID.unique_id) {
      console.log("on line 29");
      return res.status(200).json({
        status: "success",
        data: getUID,
        msg: "couldn't get any uid for mail",
      });
    } else if (
      getUID &&
      getUID.email &&
      getUID.unique_id &&
      !getUID.unique_id.unique_id
    ) {
      console.log("on line 40");
      return res.status(200).json({
        status: "success",
        data: getUID,
        msg: "couldn't get any uid for mail",
      });
    } else if (
      getUID &&
      getUID.email &&
      getUID.unique_id &&
      getUID.unique_id.unique_id
    ) {
      console.log("on line 52");
      req.email = mailId;
      return next();
    }
    console.log("on line 56");
    req.email = mailId;
    return next();
    // return res.status(200).json({
    //   status: "success",
    //   msg: `Either RootMail or UID not found by mailId: ${mailId}`,
    // });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      msg: `Cannot check for RootMail & UID by mailId: ${mailId}`,
    });
    // throw new Error();
  }
};

module.exports = uidExistsForMail;
