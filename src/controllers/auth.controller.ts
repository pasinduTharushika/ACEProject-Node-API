import { transformAndValidate } from "class-transformer-validator";
import {
  deleteRefreshTokens,
  getRefreshToken,
  getUserByEmail,
  getUserById,
} from "../repo/user.repo";
import { AppCodes } from "../types/enum/appCodes";
import { LoginRequestDto } from "../types/request/loginRequestDto";
import { RefreshTokenRequestDto } from "../types/request/refreshTokenRequestDto";
import {
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../util/jwtHelper";
import {
  generateSuccessResponse,
  generateFailedResponse,
  formatValidationErrorMsg,
} from "../util/responseWrapper";
import { compareHash } from "../util/utils";

export const login = async (request:any, response:any) => {
  await transformAndValidate(LoginRequestDto, request.body)
    .then(async (_loginRequest: LoginRequestDto | LoginRequestDto[]) => {
      const loginRequest = Array.isArray(_loginRequest)? _loginRequest[0]: _loginRequest;
      const user = await getUserByEmail(loginRequest.userName);
      
      if (user && compareHash(user.password, loginRequest.password)) {
        const jwtToken = generateAccessToken(user);
        
        const refreshToken = await generateRefreshToken(user);
        
        response.status(200).send(
          generateSuccessResponse({
            accessToken: jwtToken,
            refreshToken: refreshToken,
            userEmail: user.email,
            name:user.name
          })
        );
      } else {
        return response
          .status(400)
          .json(
            generateFailedResponse(
              "Invalid Credentials",
              AppCodes.INVALIDCREDENTIALS
            )
          );
      }
    })
    .catch((err) => {
      response
        .status(400)
        .json(
          generateFailedResponse(
            formatValidationErrorMsg(err),
            AppCodes.VALIDATIONFAILED
          )
        );
    });
};

export const refreshToken = async (request : any, response : any) => {
  await transformAndValidate(RefreshTokenRequestDto, request.body)
    .then(async (_refreshTokenRequest: RefreshTokenRequestDto | RefreshTokenRequestDto[]) => {
      const refreshTokenRequest = Array.isArray(_refreshTokenRequest)? _refreshTokenRequest[0]: _refreshTokenRequest;
      if (authenticateRefreshToken(refreshTokenRequest.refreshToken)) {
        const dbRefreshToken = await getRefreshToken(
          refreshTokenRequest.refreshToken
        );
        if (
          dbRefreshToken &&
          dbRefreshToken.user_id &&
          dbRefreshToken.active &&
          dbRefreshToken.expiry_at >= new Date()
        ) {
          const user = await getUserById(dbRefreshToken.user_id);
          if (user) {
            const jwtToken = generateAccessToken(user);
            response.status(200).send(
              generateSuccessResponse({
                accessToken: jwtToken,
                refreshToken: dbRefreshToken.refresh_token,
                userEmail: user.email,
              })
            );
          } else {
            return response
              .status(400)
              .json(
                generateFailedResponse(
                  "Invalid User",
                  AppCodes.REFRESHTOKENFAIL
                )
              );
          }
        } else {
          return response
            .status(400)
            .json(
              generateFailedResponse(
                "Refresh Token Failed",
                AppCodes.REFRESHTOKENFAIL
              )
            );
        }
      } else {
        return response
          .status(400)
          .json(
            generateFailedResponse(
              "Refresh Token JWT Validation Failed",
              AppCodes.REFRESHTOKENFAIL
            )
          );
      }
    })
    .catch((err) => {
      response
        .status(400)
        .json(
          generateFailedResponse(
            formatValidationErrorMsg(err),
            AppCodes.VALIDATIONFAILED
          )
        );
    });
};

export const logout = async (request:any, response:any) => {
  const user_id = request.user.user_id;
  if (user_id) {
    ///can make refresh token inactive insted if needed the trace
    const status = await deleteRefreshTokens(user_id);
    if (status) {
      response.status(200).send(generateSuccessResponse());
    } else {
      response
        .status(400)
        .send(
          generateFailedResponse(
            "Error while logging out",
            AppCodes.SERVERERROR
          )
        );
    }
  } else {
    response
      .status(400)
      .send(
        generateFailedResponse("No Refresh Token Found", AppCodes.SERVERERROR)
      );
  }
};
