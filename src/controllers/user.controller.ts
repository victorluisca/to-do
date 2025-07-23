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

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const parseResult = userIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    const userId = parseResult.data.id;

    try {
      const user = await this.userService.getUserById(userId);
      res.status(200).json(user);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      if (error.message === "User not found") {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const idParse = userIdSchema.safeParse(req.params);
    if (!idParse.success) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Request body is required" });
      return;
    }
    const bodyParse = updateUserSchema.safeParse(req.body);
    if (!bodyParse.success) {
      res.status(400).json({ errors: bodyParse.error });
      return;
    }

    const userId = idParse.data.id;
    const updateData = bodyParse.data;

    try {
      const updatedUser = await this.userService.updateUser(userId, updateData);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.message === "User not found") {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const parseResult = userIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    const userId = parseResult.data.id;

    try {
      await this.userService.deleteUser(userId);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: error.message });
    }
  }
}
