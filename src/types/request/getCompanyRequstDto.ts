import { IsOptional } from "class-validator";


export class GetCompanyRequestDto {
  @IsOptional()
  country: string;
  constructor(country: string) {
    this.country = country;
  }
}