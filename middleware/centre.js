const { db } = require("../database/db");
const CentreModel = db.Centre;

const isValidCentreId = async (req, res, next) => {
  const { centre_id } = req.query;
  try {
    if (!centre_id || Number.isNaN(centre_id) || Number.parseInt(centre_id)) {
      return res.status(400).json({
        status: "fail",
        msg: `Centre id not present or not an integer!`,
      });
    }
    const validCentreId = await CentreModel.findOne({
      raw: true,
      where: {
        id: centre_id,
      },
      attributes: ["centre"],
    });
    if (validCentreId && validCentreId) {
      req.centre_id = centre_id;
      next();
    }
    return res.status(400).json({
      status: "fail",
      msg: `Centre id not valid!`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      msg: `Failed to validate centre!`,
      error: err,
    });
  }
};

module.exports = isValidCentreId;
