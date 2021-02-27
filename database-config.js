require("dotenv").config();

let password;
let database;
let port;
let user;
let server;

if (process.env.NODE_ENV === "test"){
    password = process.env.TEST_DB_PASSWORD;
    database = process.env.TEST_DB_NAME;
    port = +process.env.TEST_DB_PORT
    user = process.env.TEST_DB_USER
    server = process.env.TEST_DB_HOST
}
else {
    password = process.env.DB_PASSWORD;
    database = process.env.DB_NAME;
    port = +process.env.DB_PORT
    user = process.env.DB_USER
    server = process.env.DB_HOST
}

module.exports = {
    password,
    database,
    stream: false,
    options: {
      enableArithAbort: true,
      encrypt: true
    },
    port,
    user,
    server
}
