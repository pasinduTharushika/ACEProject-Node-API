
import { getCoutries } from "../repo/country.repo";
import {

  generateSuccessResponse,
} from "../util/responseWrapper";

export const countries = async(request:any, response:any) => {
    const countries = await getCoutries();
    return response.status(200).send(generateSuccessResponse(countries));
}