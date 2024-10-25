import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'Abdelrehman Mamdouh',
    description: 'Name of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'abdelrehmanmamdouh@gmail.com',
    description: 'Email of the user',
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
