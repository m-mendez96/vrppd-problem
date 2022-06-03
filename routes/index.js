const express = require("express");

const routingRoute = require("./routing");


function routerApi(app){
    const router = express.Router();
    app.use("/api/", router);

    router.use("/routing", routingRoute);
}

module.exports = routerApi
