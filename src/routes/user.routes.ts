import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.use(authenticate);

router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.patch("/:id", userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
