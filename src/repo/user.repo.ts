import pool from "../dbconfig/dbconnector";
import { dbo, table } from "../dbconfig/dbtables";
import { RefreshToken } from "../types/model/refreshToken.model";
import { User } from "../types/model/user.model";
import { RegisterUser } from "../types/request/registerUser";
import { hashPassword } from "../util/utils";

export const getUserByEmail = async (email: string): Promise<User|null> => {
  const client = await pool.connect();
  try {
    const sql = `SELECT * FROM ${dbo}.${table.user} WHERE email = '${email}' LIMIT 1`;
    const { rows } = await client.query(sql);
    return rows[0] as User ?? null;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    client.release();
  }
};
export const getUserById = async (id: number): Promise<User> => {
  const client = await pool.connect();
  try {
    const sql = `SELECT * FROM ${dbo}.${table.user} WHERE id = ${id} LIMIT 1`;
    const { rows } = await client.query(sql);
    return rows[0] as User;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    client.release();
  }
};
export const deleteRefreshTokens = async (user_id: number): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const sql = `DELETE FROM ${dbo}.${table.refreshToken} WHERE id = ${user_id}`;
    await client.query(sql);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.release();
  }
};
export const createRefreshToken = async ({
  user_id,
  refreshToken,
  generatedAt,
  expiryAt,
  active,
}:{
  user_id : any,
  refreshToken : any,
  generatedAt : any,
  expiryAt : any,
  active : any
}
): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const sql = `INSERT INTO ${dbo}.${table.refreshToken} (user_id,refresh_token,generated_at,expiry_at,active) 
    VALUES ('${user_id}', '${refreshToken}', '${generatedAt}', '${expiryAt}', ${active})`;

    await client.query(sql);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.release();
  }
};
export const getRefreshToken = async (
  refreshToken: string
): Promise<RefreshToken | null> => {
  const client = await pool.connect();
  try {
    const sql = `SELECT * FROM ${dbo}.${table.refreshToken} WHERE refresh_token = '${refreshToken}' and active=true LIMIT 1`;
    const { rows } = await client.query(sql);
    return rows[0] as RefreshToken;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    client.release();
  }
};
export const createUser = async (
  userRegister: RegisterUser
): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const sql = `INSERT INTO ${dbo}.${table.user} (email,password,name,created_at) 
      VALUES ('${userRegister.email}', '${hashPassword(userRegister.password)}', '${userRegister.name}', '${new Date().toISOString()}')`;
    await client.query(sql);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.release();
  }
};
