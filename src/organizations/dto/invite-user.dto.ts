import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteUserDto {
  @ApiProperty({
    example: 'abdelrehmanmamdouh@gmail.com',
    description: 'Email of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
