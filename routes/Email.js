const express = require('express')
const router = express.Router()

const {isRootMail, verifyMail} = require("../controllers/Email")

router.post("/verifyMail", verifyMail);
router.get("/isRootMail", isRootMail);
module.exports= router