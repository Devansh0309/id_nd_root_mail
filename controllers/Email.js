const { Op } = require("sequelize");
const { db } = require("../database/db");
const generateToken = require("../services/generateJWTToken");
const generateOTP = require("../services/generateOTP");
const sendEmail = require("../services/sendVerifyCodeToMail");
const EmailModel = db.Email;
const EmailOTPModel = db.EmailOTP;
const UIDModel = db.UniqueIds;
const UserModel = db.Users;
const jwt = require("jsonwebtoken");

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
      attributes: ["root_mail", "email"],
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

const sendVerifyCodeToMail = async (req, res, next) => {
  console.log(req.query);
  const { user_id, email } = req.query;
  try {
    if (!user_id) {
      return res.status(400).json({
        status: "fail",
        msg: `User id not present!`,
      });
    }
    if (!email) {
      return res.status(400).json({
        status: "fail",
        msg: `Email not present!`,
      });
    }

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await EmailOTPModel.create({
      email,
      otp,
      expires_at: expiresAt,
    });
    //service api, external api, request, where server is a client requesting other server to send mail: send otp on mail for mail verification use NodeMailer or other service.
    // const signWith = { user_id, email };
    // const secretKey = process.env.JWT_SECRET;
    // // console.log({env:process.env, secretKey})
    // const token = generateToken(signWith, secretKey);
    // const verificationLink = `http://localhost:8000/email/verifyMail?token=${token}`;
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Verify Your Email",
    //   html: `
    //   <h3>Email Verification</h3>
    //   <p>Click below to verify your email(expires in one day after mail is sent):</p>
    //   <a href="${verificationLink}">Verify Email</a>
    // `,
    // };
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Email Verification</h2><p>Your OTP is:</p><h1>${otp}</h1><p>Valid for 5 minutes</p>`,
    };
    return await sendEmail(mailOptions, res);
  } catch (error) {
    console.error(
      "Failed to send email or generate token or setup nodemailer!",
      error,
    );
    throw new Error(error);
  }
};

const verifyMail = async (req, res, next) => {
  // const { token } = req.query;
  const { email, otp, user_id } = req.query;

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const user = await UserModel.findByPk(decoded.user_id);
    // const email = await EmailModel.findOne({
    //   where: {
    //     email: decoded.email,
    //     root_mail: 1,
    //   },
    //   raw: true,
    // });
    // if (!user) return res.status(400).send("Invalid user");
    const record = await EmailOTPModel.findOne({
      where: {
        email,
        otp,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (!record) {
      console.log("Record not found or Invalid or expired OTP");

      return res
        .status(200)
        .json({
          err: "expired",
          msg: "Invalid or expired OTP",
          status: "fail",
        });
    }

    record.is_verified = true;
    await record.save();

    const signWith = { user_id, email };
    const secretKey = process.env.JWT_SECRET;
    // // console.log({env:process.env, secretKey})
    const token = generateToken(signWith, secretKey);
    console.log({ token }, "Email verified successfully!");
    // if (!email || !email.root_mail)
    //   return res.status(400).send("Invalid root email");

    res
      .status(200)
      .json({ msg: "Email verified successfully!", token, status: "success" });
  } catch (err) {
    console.log({ err });
    res.status(400).send("Invalid or expired token");
  }
};

const addRootMail = async (req, res, next) => {
  //add self mail as root mail if uid exists by details used to check uid exists before creating.
  let { email, uniq_id } = req.query;
  uniq_id = parseInt(uniq_id);
  if (!email) {
    console.log("on line 162");
    return res.status(400).json({
      status: "fail",
      msg: `Mail not present!`,
    });
  }
  if (
    !uniq_id ||
    (uniq_id && Number.isNaN(uniq_id)) ||
    (uniq_id && !parseInt(uniq_id))
  ) {
    console.log("on line 173");
    return res.status(400).json({
      status: "fail",
      msg: `Either uid not present or uid not in correct format!`,
    });
  }
  try {
    const [createMailNdUIDEntry, created] = await EmailModel.findOrCreate({
      where: { email, uniq_id, root_mail: 1 },
      defaults: {
        email,
        uniq_id,
        root_mail: 1,
      },
    });
    if (created) {
      console.log("on line 187");
      return res.status(200).json({
        status: "success",
        msg: `New entry created for mail & uid: ${createMailNdUIDEntry}!`,
        data: createMailNdUIDEntry.root_mail,
      });
    } else if (createMailNdUIDEntry && !created) {
      console.log("on line 194");
      return res.status(200).json({
        status: "success",
        msg: `Entry for mail & uid: ${createMailNdUIDEntry}, already exists!`,
        data: createMailNdUIDEntry.root_mail,
      });
    }
    console.log("on line 201");
    return res.status(500).json({
      status: "fail",
      msg: `Entry for mail & uid: ${createMailNdUIDEntry}, not found & neither created!`,
    });
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      msg: `Entry for mail & uid couldn't be found or created!`,
    });
    // throw new Error();
  }
};

module.exports = { isRootMail, sendVerifyCodeToMail, verifyMail, addRootMail };
