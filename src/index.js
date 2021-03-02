//Injection
require("./injection/resolver/factory");
require("./injection/resolver/repository-sqlserver");
require("./injection/resolver/service");

const app = require("./app");

const PORT = process.env.PORT ? +process.env.PORT : 8000;

// Run App
app.listen(PORT, () => {
    console.log(`Running server at Port: ${PORT}`);
});
