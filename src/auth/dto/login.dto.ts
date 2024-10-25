import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'abdelrehmanmamdouh@gmail.com',
    description: 'Email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'test123456',
    description: 'Password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
