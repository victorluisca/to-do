import { DeepPartial } from "typeorm";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";
import { AppError } from "../utils/errorHandler";

const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);

export class TaskService {
  async createTask(
    userId: number,
    title: string,
    description?: string | null
  ): Promise<Partial<Task>> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const task = new Task();

    task.title = title;
    task.description = description || null;
    task.user = user;

    await taskRepository.save(task);

    const { user: _, ...result } = task;

    return result;
  }

  async getAllTasks(userId: number): Promise<Partial<Task>[]> {
    const tasks = await taskRepository.find({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    return tasks.map(({ user: _, ...task }) => task);
  }

  async getTaskById(taskId: number, userId: number): Promise<Partial<Task>> {
    const task = await taskRepository.findOne({
      where: {
        id: taskId,
        user: { id: userId },
      },
      relations: ["user"],
    });
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const { user: _, ...result } = task;

    return result;
  }

  async updateTask(
    userId: number,
    taskId: number,
    taskData: DeepPartial<Task>
  ): Promise<Partial<Task>> {
    const task = await taskRepository.findOne({
      where: {
        id: taskId,
        user: { id: userId },
      },
    });
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    Object.assign(task, taskData);

    await taskRepository.save(task);

    const { user: _, ...result } = task;

    return result;
  }

  async deleteTask(taskId: number, userId: number) {
    const result = await taskRepository.delete({
      id: taskId,
      user: { id: userId },
    });
    return result.affected === 1;
  }
}
