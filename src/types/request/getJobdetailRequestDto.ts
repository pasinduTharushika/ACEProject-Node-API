import { IsOptional } from "class-validator";


export class GetJobDetaileRequestDto {
  @IsOptional()
  country: string;
  @IsOptional()
  company: string;
  constructor(country: string,company:string) {
    this.country = country;
    this.company=company;
  }
}