import dotenv from "dotenv";

dotenv.config({ quiet: true });

import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { authRouter, taskRouter, userRoutes } from "./routes";
import { errorHandler } from "./utils/errorHandler";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/", authRouter);
app.use("/tasks", taskRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Press CTRL+C to stop the server");
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  });
