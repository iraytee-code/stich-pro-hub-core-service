import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class OrganizationSignupDto {
  @ApiProperty({
    type: 'string',
    example: 'Sarah Fashion Store',
    description: 'Name of the organization',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    example: '09011847868',
    description: 'Organization official phone number',
  })
  @IsString()
  @IsNotEmpty()
  orgPhoneNumber: string;

  @ApiProperty({
    type: 'string',
    example: 'sarah@fashionstore.com',
    description: 'Organization official email address',
  })
  @IsString()
  @IsNotEmpty()
  contactEmail: string;

  @ApiProperty({
    type: 'string',
    example: '123 Main St',
    description: 'Organization address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: 'string',
    example: 'China Town',
    description: 'Organization city',
  })
  city: string;

  @ApiProperty({
    type: 'string',
    example: 'CA',
    description: 'Organization state',
  })
  state: string;

  @ApiProperty({
    type: 'string',
    example: 'USA',
    description: 'Organization country',
  })
  country: string;

  @ApiProperty({
    type: 'string',
    example: 'SarahJane@gmail.com',
    description: 'Personal email of the owner',
  })
  @IsString()
  @IsNotEmpty()
  ownerEmail: string;

  @ApiProperty({
    type: 'string',
    example: '123456',
    description: 'Password for the owner account',
  })
  @IsString()
  @IsNotEmpty()
  ownerPassword: string;

  @ApiProperty({
    type: 'string',
    example: 'Sarah',
    description: 'First name of the owner',
  })
  @IsString()
  @IsNotEmpty()
  ownerFirstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Jane',
    description: 'Last name of the owner',
  })
  @IsString()
  @IsNotEmpty()
  ownerLastName: string;
}
