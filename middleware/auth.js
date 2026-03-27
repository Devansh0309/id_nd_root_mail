const {db} = require("../database/db")
const User = db.Users
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  // getting token and check of it's there
  try {
    let token;
    // console.log(req.headers)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.replace("Bearer ", "");
      //.split(" ")[1];
      //  console.log({myToken:token});
    }

    if (!token || typeof token !== "string") {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }

    // console.log({
    //   token
    // });

    // verification token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)

    // check if user still exist

    const freshUser = await User.findByPk(decoded.id, {
      raw: true,
      attributes: ["id"],
    });

    if (!freshUser) {
      return next(
        new AppError("The user belonging to this token does no longer exist"),
      );
    }

    // console.log({freshUser})

    // check if user changed password after the token was issued

    //    if(freshUser.changedPassword(decoded.iat)){

    //     return next(new AppError('User recently changed password! Please log in again',401))

    //    }

    req.user = freshUser;

    // console.log("USER_PORT",req.user)

    next();
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = protect
