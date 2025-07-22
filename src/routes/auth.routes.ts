import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", authController.registerUser.bind(authController));
router.post("/login", authController.login.bind(authController));

export default router;
