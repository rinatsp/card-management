import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'rinat@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongpassword',
    description: 'Password of the user',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
