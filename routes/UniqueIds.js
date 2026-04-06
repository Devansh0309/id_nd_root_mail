const express = require('express')
const router = express.Router()
const { showUID, createUID } = require("../controllers/UIDs")

router.get("/createUID", createUID);
router.get("/showUID", showUID);
module.exports= router