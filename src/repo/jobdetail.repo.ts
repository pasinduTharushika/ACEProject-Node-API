
import pool from "../dbconfig/dbconnector";
import { dbo, table } from "../dbconfig/dbtables";
import { Jobdetail } from "../types/model/jobdetail.model";

export const getJobdetailData = async (
  jobdetailRequest: any
): Promise<Jobdetail[]> => {
  const client = await pool.connect();
  try {


const sql = (jobdetailRequest.country == 0  && jobdetailRequest.company==0 ?`SELECT * FROM ${dbo}.${table.jobdetails}`
:(jobdetailRequest.country != 0  && jobdetailRequest.company==0 ? `SELECT * FROM ${dbo}.${table.jobdetails} WHERE COUNTRYID = ${jobdetailRequest.country}`:`SELECT * FROM ${dbo}.${table.jobdetails} WHERE COUNTRYID = ${jobdetailRequest.country} AND COMPANYID = ${jobdetailRequest.company}`) );


    const { rows } = await client.query(sql);
    const response = rows as Jobdetail[];
    return response;
    
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    client.release();
  }
};
