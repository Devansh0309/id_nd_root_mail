const express = require('express')
const getCentres = require('../controllers/centre')
const router = express.Router()

router.get("/getCentres", getCentres)

module.exports = router