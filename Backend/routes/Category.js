var express = require("express");
var router = express.Router();
const controller = require("../controller/Category");

router.get("/get/:id", controller.getCategories);
router.put("/update/:id", controller.updateCategory);
router.post("/create/:id", controller.createCategory);
router.delete("/delete/:id", controller.deleteCategory);

module.exports = router;
