import { IsEmail, IsString } from "class-validator";

export class RegisterUser {
  @IsEmail()
  email: string;
  @IsString({ message: "Password must have a value" })
  password: string;
  @IsString({ message: "Name must have a value" })
  name:string;

  constructor(email: string, password: string, name:string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
