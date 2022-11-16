import pool from "../dbconfig/dbconnector";
import { dbo, table } from "../dbconfig/dbtables";
import { Company } from "../types/model/company.model";

export const getCompanyData = async (companyRequest: any): Promise<Company[]> => {
  const client = await pool.connect();
  try {
    const sql =
    companyRequest.country == 0
    ? `SELECT * FROM ${dbo}.${table.company}`
    : `SELECT * FROM ${dbo}.${table.company} WHERE COUNTRYID = ${companyRequest.country}`;
    const { rows } = await client.query(sql);
    const response  = rows as Company[];
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    client.release();
  }
};
