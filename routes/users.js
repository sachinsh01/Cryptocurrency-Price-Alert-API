const express = require("express");
const router = express.Router();
const {register, login, token, logout} = require("../controllers/users");


router.post("/register", register);

router.post("/login", login);

router.post("/token", token);

router.delete("/logout", logout);


module.exports = router;