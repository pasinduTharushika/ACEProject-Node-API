/* import { transformAndValidate } from "class-transformer-validator";
import { getCoutries } from "../repo/country.repo";
import { AppCodes } from "../types/enum/appCodes";

import { defaultOutbrakeObj } from "../types/default/defaultOutbrakeObj"
import {
  formatValidationErrorMsg,
  generateFailedResponse,
  generateSuccessResponse,
} from "../util/responseWrapper"; */
import {
  formatValidationErrorMsg,
  generateFailedResponse,
  generateSuccessResponse,
} from "../util/responseWrapper";
import { getCompanyData } from "../repo/company.repo";
import { GetCompanyRequestDto } from "../types/request/getCompanyRequstDto";
import { transformAndValidate } from "class-transformer-validator";
import { AppCodes } from "../types/enum/appCodes";


export const companies = async(request:any, response:any) => {
  await transformAndValidate(GetCompanyRequestDto, request.query)
  .then(async (_companyRequest: GetCompanyRequestDto | GetCompanyRequestDto[]) => {
      const companyRequest = Array.isArray(_companyRequest)? _companyRequest[0]: _companyRequest;
      debugger;
    const companyResults = await getCompanyData(companyRequest);
    return response.status(200).send(generateSuccessResponse(companyResults));
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
     /* const countries = await getCompanyData();
    return response.status(200).send(generateSuccessResponse(countries));  */
}