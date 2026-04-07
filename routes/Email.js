const express = require('express')
const router = express.Router()
const otpLimiter = require("../middleware/rateLimit")
const {isRootMail, verifyMail, addRootMail, sendVerifyCodeToMail} = require("../controllers/Email")
// const {rootMailExists} = require("../middleware/rootMailExists")
router.get("/addRootMail", addRootMail);
router.get("/isRootMail", isRootMail);
// router.use(rootMailExists)
router.get("/createVerifyMailCode", otpLimiter, sendVerifyCodeToMail);
router.get("/verifyMail", verifyMail);

module.exports= router