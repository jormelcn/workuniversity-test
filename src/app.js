const express = require('express');
const cors = require('cors');

const {
    vehicleTypeCrudRouter
} = require("./infrastructure/endpoint/vehicle-type-crud-endpoint");

const {
    workDayRouter
} = require("./infrastructure/endpoint/work-day-endpoint");

const {
    orderServiceRouter
} = require("./infrastructure/endpoint/order-service-endpoint");

var app = express();
app.use(cors());
app.use(express.json());

app.use("/vehicle-type", vehicleTypeCrudRouter);
app.use("/order-service", orderServiceRouter);
app.use("/work-day", workDayRouter);


module.exports = app
