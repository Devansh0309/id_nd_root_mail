const { db } = require("../database/db");

const CentreModel = db.Centre;

const getCentres = async (req, res, next) => {
  try {
    const allCentres = await CentreModel.findAll({
      raw: true,
      attributes: ["id", "centre"],
    });
    if (allCentres && allCentres.length) {
      return res.status(200).json({
        msg: "all centres fetched successfully!",
        data: allCentres,
        status: "success"
      });
    }
    return res.status(500).json({
      msg: "all centres fetched failed!",
      status: "fail"
    });
  } catch (error) {
    console.log({ error });
    throw new Error();
  }
};
module.exports = getCentres;
