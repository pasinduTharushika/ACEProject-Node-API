import { Router } from "express";
import { jobdetail } from "../controllers/jobdetails.controller";

const Jobdetail = Router();

Jobdetail.get("/", jobdetail);

export default Jobdetail;