import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'Login with email and password',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Signup',
    description: 'Signup: creating my new account',
  })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({
    summary: 'refresh-token',
    description: 'refresh-token: Generating new access token',
  })
  @Post('refresh-token')
  async refreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.refreshToken(body);
  }

  @ApiOperation({
    summary: 'revoke-refresh-token',
    description: 'revoke-refresh-token: Removing certain refresh tokens',
  })
  @Post('revoke-refresh-token')
  async revokeRefreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.revokeRefreshToken(body);
  }
}
