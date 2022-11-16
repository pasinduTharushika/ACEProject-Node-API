import { Router } from "express";
import { companies } from "../controllers/company.controller";

const company = Router();

company.get("/", companies);

export default company;