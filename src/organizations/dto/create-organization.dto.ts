import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'Book lovers',
    description: 'Name of the organization',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Organization to collect books.',
    description: 'Description of the organization',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
