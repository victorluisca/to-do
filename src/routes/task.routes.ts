import { Router } from "express";
import { TaskService } from "../services/task.service";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.use(authenticate);

router.post("/", taskController.createTask.bind(taskController));
router.get("/", taskController.getAllTasks.bind(taskController));
router.get("/:id", taskController.getTaskById.bind(taskController));
router.patch("/:id", taskController.updateTask.bind(taskController));
router.delete("/:id", taskController.deleteTask.bind(taskController));

export default router;
