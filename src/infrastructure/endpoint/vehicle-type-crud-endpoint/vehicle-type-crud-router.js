const express = require("express");
const controller = require("./vehicle-type-crud-controller");

const router = express.Router()

router.get("/", controller.getAll);
router.post("/", controller.save);
router.put("/:id", controller.update);


module.exports = router;
