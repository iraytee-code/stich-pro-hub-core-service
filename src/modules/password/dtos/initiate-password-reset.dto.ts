import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class InitiatePasswordResetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'john.doe@example.com',
    description: 'Email address of the Organization',
  })
  email: string;
}
