const express = require("express");
const controller = require("./work-day-controller");

const router = express.Router()


router.get("/", controller.getWorkDaysFromTo);


module.exports = router;
