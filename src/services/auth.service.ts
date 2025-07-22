import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export class AuthService {
  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<Partial<User>> {
    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new Error("Username or email already in use");
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
      throw new Error("Invalid username or password");
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
