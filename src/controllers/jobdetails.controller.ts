
import {
  formatValidationErrorMsg,
  generateFailedResponse,
  generateSuccessResponse,
} from "../util/responseWrapper"; 
import { GetJobDetaileRequestDto } from "../types/request/getJobdetailRequestDto";
import { transformAndValidate } from "class-transformer-validator";
import { getJobdetailData } from "../repo/jobdetail.repo";
import { AppCodes } from "../types/enum/appCodes";
export const jobdetail = async (request:any, response:any) => {
    await transformAndValidate(GetJobDetaileRequestDto, request.query)
      .then(async (_jobdetailRequest: GetJobDetaileRequestDto | GetJobDetaileRequestDto[]) => {
          const jobdetailRequest = Array.isArray(_jobdetailRequest)? _jobdetailRequest[0]: _jobdetailRequest;
        const jobdetailResults = await getJobdetailData(jobdetailRequest);
        return response.status(200).send(generateSuccessResponse(jobdetailResults));
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