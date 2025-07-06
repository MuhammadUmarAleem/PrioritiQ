var express = require("express");
var router = express.Router();
const controller = require("../controller/Auth");

router.post("/register", controller.register);
router.post("/verify", controller.verifyUser);
router.post("/login", controller.login);
router.put("/updatePassword/:id", controller.updatePassword);
router.get("/verifyToken", controller.verifyToken);

module.exports = router;
