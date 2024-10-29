const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/searchUser", userController.searchUsers);

module.exports = router;
