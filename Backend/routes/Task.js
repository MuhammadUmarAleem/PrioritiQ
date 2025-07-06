var express = require("express");
var router = express.Router();
const controller = require("../controller/Task");

router.get("/get/:id", controller.getTasks);
router.put("/update/:id", controller.updateTask);
router.post("/create/:id", controller.createTask);
router.delete("/delete/:id", controller.deleteTask);
router.put("/toggleTaskStatus/:id", controller.toggleTaskStatus);

module.exports = router;
