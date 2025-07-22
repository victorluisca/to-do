import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    try {
      const user = await this.authService.registerUser(
        username,
        email,
        password
      );

      res.status(201).json(user);
    } catch (error: any) {
      if (error.message === "Username or email already in use") {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      const token = await this.authService.login(username, password);

      res.status(200).json({ token: token });
    } catch (error: any) {
      if (error.message === "Invalid username or password") {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }
}
