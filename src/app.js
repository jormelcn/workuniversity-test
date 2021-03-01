const express = require('express');
const cors = require('cors');

const {
    vehicleTypeCrudRouter
} = require("./infrastructure/endpoint/vehicle-type-crud-endpoint");



var app = express();
app.use(cors());
app.use(express.json());

app.use("/vehicle-type", vehicleTypeCrudRouter);



module.exports = app
