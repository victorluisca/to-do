import { Request, Response } from "express";
import { UserService } from "../services/user.service";

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
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

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
    const userId = parseInt(req.params.id);
    const { username, email } = req.body || {};

    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Request body is required" });
      return;
    }

    try {
      const updateData: { username?: string; email?: string } = {};

      if (username !== undefined) {
        updateData.username = username;
      }

      if (email !== undefined) {
        updateData.email = email;
      }

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
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    try {
      await this.userService.deleteUser(userId);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: error.message });
    }
  }
}
