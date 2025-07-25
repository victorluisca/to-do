import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import z from "zod";

const createTaskSchema = z
  .object({
    title: z.string().min(3),
    description: z.string().optional().nullable(),
  })
  .strict();

const taskIdSchema = z
  .object({
    id: z.string().regex(/^\d+$/, "User ID must be a number").transform(Number),
  })
  .strict();

const updateTaskSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().optional().nullable(),
    isCompleted: z.boolean().optional(),
  })
  .strict();

export class TaskController {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  async createTask(req: Request, res: Response, next: Function): Promise<void> {
    const userId = req.user.id;
    if (!userId) {
      next("Unauthorized: User ID not found in request", 401);
      return;
    }
    const parseResult = createTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(parseResult.error);
    }

    const { title, description } = parseResult.data;

    try {
      const task = await this.taskService.createTask(
        userId,
        title,
        description
      );
      res.status(201).json({ task });
    } catch (error) {
      next(error);
    }
  }

  async getAllTasks(
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> {
    const userId = req.user.id;
    if (!userId) {
      next("Unauthorized: User ID not found in request", 401);
      return;
    }

    try {
      const tasks = await this.taskService.getAllTasks(userId);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> {
    const userId = req.user.id;
    if (!userId) {
      next("Unauthorized: User ID not found in request", 401);
      return;
    }
    const parseResult = taskIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return next(parseResult.error);
    }
    const taskId = parseResult.data.id;

    try {
      const task = await this.taskService.getTaskById(taskId, userId);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: Function) {
    const userId = req.user.id;
    if (!userId) {
      next("Unauthorized: User ID not found in request", 401);
      return;
    }
    const idParse = taskIdSchema.safeParse(req.params);
    if (!idParse.success) {
      return next(idParse.error);
    }
    const bodyParse = updateTaskSchema.safeParse(req.body);
    if (!bodyParse.success) {
      return next(bodyParse.error);
    }

    const taskId = idParse.data.id;
    const updateData = bodyParse.data;

    try {
      const updatedTask = await this.taskService.updateTask(
        userId,
        taskId,
        updateData
      );
      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: Function) {
    const userId = req.user.id;
    if (!userId) {
      next("Unauthorized: User ID not found in request", 401);
      return;
    }
    const parseResult = taskIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return next(parseResult.error);
    }
    const taskId = parseResult.data.id;

    try {
      await this.taskService.deleteTask(taskId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
