import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { userRoutes } from "./routes";

dotenv.config({ quiet: true });

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

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
