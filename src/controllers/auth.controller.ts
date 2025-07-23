import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import z from "zod";

const registerUserSchema = z
  .object({
    username: z.string().min(3),
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).*$/,
        "Password must include at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
  })
  .strict();

const loginSchema = z
  .object({
    username: z.string().min(3),
    password: z.string(),
  })
  .strict();

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async registerUser(
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> {
    const parseResult = registerUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(parseResult.error);
    }
    const { username, email, password } = parseResult.data;

    try {
      const user = await this.authService.registerUser(
        username,
        email,
        password
      );
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: Function): Promise<void> {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(parseResult.error);
    }

    const { username, password } = parseResult.data;

    try {
      const token = await this.authService.login(username, password);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}
