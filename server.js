const path = require("path");
const Bodypars = require("body-parser");
const express = require("express");

const shopRoute = require("./Router/shop");
const adminRoute = require("./Router/admiin");
const eruerRoute = require("./Controllers/eruer");

const app = express();

app.set("view engine", "EJS");
app.set("views", "Views");

app.use(Bodypars.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);

app.use(shopRoute);

app.use(eruerRoute);
app.listen(2000);
