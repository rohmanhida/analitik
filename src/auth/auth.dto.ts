import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class registerDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  password_confirm: string;
}

export class passwordResetDto {
  @IsNotEmpty()
  @IsString()
  current_password: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}

export class generateTokenDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class emailVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
