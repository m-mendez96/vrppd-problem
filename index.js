const express = require("express");

const routerApi = require("./routes")

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res)=> {
    res.send("Server Express");
});

routerApi(app);

app.listen(port, ()=>{
    console.log("Server running on port: " + port);
});
