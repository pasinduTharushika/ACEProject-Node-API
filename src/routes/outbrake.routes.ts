import { Router } from "express";
import { outbrake } from "../controllers/outbrake.controller";

const outbrakeRouter = Router();

outbrakeRouter.get("/", outbrake);

export default outbrakeRouter;