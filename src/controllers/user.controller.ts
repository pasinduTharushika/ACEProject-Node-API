import { transformAndValidate } from "class-transformer-validator";
import { createUser, getUserByEmail } from "../repo/user.repo";
import { AppCodes } from "../types/enum/appCodes";
import { RegisterUser } from "../types/request/registerUser";
import {
  formatValidationErrorMsg,
  generateFailedResponse,
  generateSuccessResponse,
} from "../util/responseWrapper";

export const registerUser = async (request : any, response: any) => {
  await transformAndValidate(RegisterUser, request.body)
    .then(async (_registerUser: RegisterUser | RegisterUser[] ) => {
    const registerUser = Array.isArray(_registerUser)? _registerUser[0]: _registerUser;
      const dbUser = await getUserByEmail(registerUser.email);
      if (!dbUser) {
        const userRegisterStatus = await createUser(registerUser);
        if (userRegisterStatus) {
          ///todo: send registration email
          return response.status(200).send(generateSuccessResponse());
        } else {
          return response
            .status(400)
            .send(
              generateFailedResponse(
                "User registrtion failed",
                AppCodes.SERVERERROR
              )
            );
        }
      } else {
        return response
          .status(400)
          .send(
            generateFailedResponse(
              "User already exists",
              AppCodes.VALIDATIONFAILED
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
