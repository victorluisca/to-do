import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import z from "zod";

const userIdSchema = z
  .object({
    id: z.string().regex(/^\d+$/, "User ID must be a number").transform(Number),
  })
  .strict();

const updateUserSchema = z
  .object({
    username: z.string().min(3).optional(),
    email: z.email().optional(),
  })
  .strict();

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> {
    const parseResult = userIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return next(parseResult.error);
    }
    const userId = parseResult.data.id;

    try {
      const user = await this.userService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: Function): Promise<void> {
    const idParse = userIdSchema.safeParse(req.params);
    if (!idParse.success) {
      return next(idParse.error);
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Request body is required" });
      return;
    }
    const bodyParse = updateUserSchema.safeParse(req.body);
    if (!bodyParse.success) {
      return next(bodyParse.error);
    }

    const userId = idParse.data.id;
    const updateData = bodyParse.data;

    try {
      const updatedUser = await this.userService.updateUser(
        userId,
        updateData,
        req
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: Function): Promise<void> {
    const parseResult = userIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return next(parseResult.error);
    }
    const userId = parseResult.data.id;

    try {
      await this.userService.deleteUser(userId, req);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
