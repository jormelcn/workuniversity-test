const express = require("express");
const controller = require("./order-service-controller");

const router = express.Router()


router.post("/new-order", controller.assignNewOrder);


module.exports = router;
