import { DeepPartial } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  async getAllUsers(): Promise<Partial<User>[]> {
    const users = await userRepository.find();
    return users.map(({ password, ...user }) => user);
  }

  async getUserById(userId: number): Promise<Partial<User>> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
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
      throw new Error("User not found");
    }

    if (userData.username !== undefined) {
      user.username = userData.username;
    }

    if (userData.email !== undefined) {
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
