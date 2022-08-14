const express = require("express");
const {authenticateToken} = require("../middleware");
const router = express.Router({ mergeParams: true });
const {alerts, create, del} = require("../controllers/alerts");


router.get("/", authenticateToken, alerts);

router.post("/create", authenticateToken, create);

router.delete("/delete", del);


module.exports = router;