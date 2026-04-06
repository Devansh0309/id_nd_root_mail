const express = require('express')
const router = express.Router()
const { showUID, createUID } = require("../controllers/UIDs");
const isValidCentreId = require('../middleware/centre');

router.get("/createUID", isValidCentreId, createUID);
router.get("/showUID", showUID);
module.exports= router