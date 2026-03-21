const express = require('express')
const router = express.Router()

const {isRootMail, verifyMail, addRootMail, sendVerifyCodeToMail} = require("../controllers/Email")
// const {rootMailExists} = require("../middleware/rootMailExists")

router.post("/addRootMail", addRootMail);
router.get("/isRootMail", isRootMail);
// router.use(rootMailExists)
router.get("/createVerifyMailCode", sendVerifyCodeToMail);
router.get("/verifyMail", verifyMail);

module.exports= router