import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandler";

const userRepository = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new AppError("JWT_SECRET is not set in environment variables", 500);
}

export class AuthService {
  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<Partial<User>> {
    const userWithEmail = await userRepository.findOne({
      where: { email },
    });
    if (userWithEmail) {
      throw new AppError("Email already in use", 409);
    }

    const userWithUsername = await userRepository.findOne({
      where: { username },
    });
    if (userWithUsername) {
      throw new AppError("Username already in use", 409);
    }

    const user = new User();

    user.username = username;
    user.email = email;

    await user.setPassword(password);

    await userRepository.save(user);

    const { password: _, ...result } = user;

    return result;
  }

  async login(username: string, password: string): Promise<string> {
    const user = await userRepository.findOne({ where: { username } });

    if (!user || !(await user.checkPassword(password))) {
      throw new AppError("Invalid username or password", 401);
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return token;
  }
}
