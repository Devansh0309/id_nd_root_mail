const express = require('express')
const router = express.Router()
const { showUID, createUID } = require("../controllers/UIDs");
const isValidCentreId = require('../middleware/centre');
const uidExistsForMail = require('../middleware/rootMailExists');

router.get("/createUID", isValidCentreId, uidExistsForMail, createUID);
router.get("/showUID", showUID);
module.exports= router