import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyPasswordResetOtpDto {
  @ApiProperty({
    example: 'organization@email.com',
    description: 'The registered organization email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The OTP code received in the owners email',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
