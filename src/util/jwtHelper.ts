const jwt = require("jsonwebtoken");

import { createRefreshToken } from "../repo/user.repo";
import { AppCodes } from "../types/enum/appCodes";
import { User } from "../types/model/user.model";
import { generateFailedResponse } from "./responseWrapper";
import { addDaysToDate } from "./utils";

const refreshTokenExpiryDays = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY_TIME_DAYS ?? "7"
);
export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    {
      email: user.email,
      user_id: user.id,
      createdAt: new Date().getTime(),
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY_TIME_SECONDS}s` }
  );
};
export const generateRefreshToken = async (user: User): Promise<string> => {
  const refreshToken = jwt.sign(
    {
      email: user.email,
      user_id: user.id,
      createdAt: new Date().getTime(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY_TIME_DAYS}d` }
  );

  const tokenStoreStatus = await createRefreshToken({
    user_id: user.id,
    refreshToken: refreshToken,
    generatedAt: (new Date()).toISOString(),
    expiryAt: (addDaysToDate(new Date(), refreshTokenExpiryDays)).toISOString(),
    active: true,
  });

  if (tokenStoreStatus) {
    return refreshToken;
  } else {
    throw new Error("Error while storing refresh token");
  }
};
export const authenticateAccessToken = (req: any, res: any, next: any) => {
  
  const token = getAuthTokenFromRequest(req);
  console.log(token);
  if (!token)
    return res
      .status(400)
      .json(
        generateFailedResponse(
          "Access token is missing",
          AppCodes.INVALIDJWTTOKEN
        )
      );

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err)
      return res
        .status(401)
        .json(
          generateFailedResponse(
            "Access token is invalid",
            AppCodes.EXPIREDJWTTOKEN
          )
        );
    req.user = user;
    next();
  });
};
export const authenticateRefreshToken = (token: string): boolean => {
  if (token == null) return false;
  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return user && user.id ? true : false;
  } catch (err) {
    return false;
  }
};
export const getAuthTokenFromRequest = (req: any): string => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
};
