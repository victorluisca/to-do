import { DeepPartial } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { AppError } from "../utils/errorHandler";

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  async getAllUsers(): Promise<Partial<User>[]> {
    const users = await userRepository.find();
    return users.map(({ password, ...user }) => user);
  }

  async getUserById(userId: number): Promise<Partial<User>> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password: _, ...result } = user;
    return result;
  }

  async updateUser(
    userId: number,
    userData: DeepPartial<User>
  ): Promise<User | null> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found", 409);
    }

    if (userData.username !== undefined) {
      const existingUser = await userRepository.findOne({
        where: { username: userData.username },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new AppError("Username already in use", 409);
      }
      user.username = userData.username;
    }

    if (userData.email !== undefined) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new AppError("Email already in use", 409);
      }
      user.email = userData.email;
    }

    // TODO: add update password

    await userRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword as User;
  }

  async deleteUser(userId: number): Promise<boolean> {
    const result = await userRepository.delete(userId);
    return result.affected === 1;
  }
}
