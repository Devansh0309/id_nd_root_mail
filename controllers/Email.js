const { db } = require("../database/db");
const EmailModel = db.Email;
const UIDModel = db.UniqueIds;

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
      raw: true,
    });
    console.log({ checkIsRootMail });
    if (checkIsRootMail && checkIsRootMail.email && checkIsRootMail.root_mail) {
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

const createVerifyMailCode = async(req,res, next)=>{
  // see this for soln. : https://chatgpt.com/share/69bd481e-0ca0-8007-b801-4f598f1cd931
}

const verifyMail = async (req, res, next) => {
  try {
    //mail verification
  } catch (error) {}
};

const addRootMail = async (req, res, next) => {
  const { email, u_id } = req.body;
  if (!email) {
    return res.status(400).json({
      status: "fail",
      msg: `Mail not present!`,
    });
  }
  if (!u_id || (u_id && Number.isNaN(u_id)) || (u_id && !parseInt(u_id))) {
    return res.status(400).json({
      status: "fail",
      msg: `Either uid not present or uid not in correct format!`,
    });
  }
  try {
    const [createMailNdUIDEntry, created] = await EmailModel.findOrCreate({
      where: { email, u_id },
      defaults: {
        email,
        u_id,
        root_mail: 1,
      },
    });
    if (created) {
      return res.status(200).json({
        status: "success",
        msg: `New entry created for mail & uid: ${createMailNdUIDEntry}!`,
      });
    } else if (createMailNdUIDEntry && !created) {
      return res.status(200).json({
        status: "success",
        msg: `Entry for mail & uid: ${createMailNdUIDEntry}, already exists!`,
      });
    }
    return res.status(500).json({
      status: "fail",
      msg: `Entry for mail & uid: ${createMailNdUIDEntry}, not found & neither created!`,
    });
  } catch (error) {
    console.error(err);
    throw new Error();
  }
};

module.exports = { isRootMail, verifyMail, addRootMail,createVerifyMailCode };
