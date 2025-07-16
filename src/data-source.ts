import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "mysecretpassword",
  database: process.env.DB_NAME || "mydatabase",
  synchronize: true, // False in production
  entities: [User],
});
