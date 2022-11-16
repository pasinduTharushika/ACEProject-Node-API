import { Router } from "express";
import { authenticateAccessToken } from "../util/jwtHelper";
import { login, logout, refreshToken } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", authenticateAccessToken, logout);

export default authRouter;