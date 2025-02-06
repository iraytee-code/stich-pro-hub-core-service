import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: '123456',
    description: 'The OTP sent to the organization email',
  })
  otp: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'SarahFashion@gmail.com',
    description: 'Official email of the organization',
  })
  email: string;
}
