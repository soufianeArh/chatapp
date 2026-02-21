import { Router, Request, Response } from "express";
import { userRoutes } from "./users.routes"

export const registerRoutes = (app: Router): void => {
  app.get("/health", (_req: Request, res: Response): void => {
    res.json({
      success: "OK",
      message: "user service api is working",
    });
  });

  app.use("/users", userRoutes)
};