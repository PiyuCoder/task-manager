const router = require("express").Router();
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/auth");

router.post("/", auth, taskController.createTask);
router.get("/search", taskController.searchTask);
router.get("/:userId", taskController.fetchTasks);
router.put("/:taskId", taskController.updateTask);
router.post("/:taskId/comments", auth, taskController.addComment);

module.exports = router;
