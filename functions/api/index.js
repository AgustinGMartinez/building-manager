const express = require("express"),
  router = express.Router()
const buildings = require("./buildings")
const users = require("./users")
const doorbells = require("./doorbells")

router.use("/buildings", buildings)
router.use("/users", users)
router.use("/doorbells", doorbells)

module.exports = router
