import { Router } from "express";
import { countries } from "../controllers/country.controller";

const country = Router();

country.get("/", countries);

export default country;