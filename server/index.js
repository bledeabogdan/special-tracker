const express = require("express");
const app = express();
const router = require("./router");
const bodyParser = require("body-parser");
const cors = require("cors");

// configure app to use body-parser
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

const port = process.env.PORT || 8090;

app.use("/api", router);

app.listen(port);
console.log("Magic happens on port " + port);
