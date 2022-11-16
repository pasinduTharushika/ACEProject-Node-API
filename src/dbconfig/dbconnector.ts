import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

export default new Pool({
  max: 20,
  connectionString: `postgres://${process.env.DB_USRE}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  idleTimeoutMillis: 30000,
});
