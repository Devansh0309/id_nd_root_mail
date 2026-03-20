const express = require('express')
const router = express.Router()

const {isRootMail, verifyMail, addRootMail, createVerifyMailCode} = require("../controllers/Email")
// const {rootMailExists} = require("../middleware/rootMailExists")

router.post("/addRootMail", addRootMail);
router.get("/isRootMail", isRootMail);
// router.use(rootMailExists)
router.post("/createVerifyMailCode", createVerifyMailCode);
router.post("/verifyMail", verifyMail);

module.exports= router