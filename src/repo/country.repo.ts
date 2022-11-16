import pool from "../dbconfig/dbconnector";
import { dbo, table } from "../dbconfig/dbtables";
import { Country } from "../types/model/country.model";

export const getCoutries = async (): Promise<Country[]> => {
    const client = await pool.connect();
    try {
      const sql = `SELECT * FROM ${dbo}.${table.country}`;
      const { rows } = await client.query(sql);
      const response  = rows as Country[];
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      client.release();
    }
  };