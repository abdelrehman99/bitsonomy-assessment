import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as argon2 from 'argon2';
import { LoginDto, SignupDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private redis: Cache,
    private config: ConfigService,
    private jwt: JwtService,
    private userService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isCorrectPassword = await argon2.verify(user.password, password);

    if (!isCorrectPassword) {
      throw new ForbiddenException('Invalid credentials');
    }

    const { access_token, refresh_token } = await this.signToken(
      user.id,
      user.email,
    );

    return { message: 'Request Successful', access_token, refresh_token };
  }

  async signup(signupDto: SignupDto) {
    const password = await argon2.hash(signupDto.password);
    const { name, email } = signupDto;

    const user = await this.userService.createUser({ name, email, password });

    await this.signToken(user.id, user.email);
    return { message: 'This user has signed up successfully' };
  }

  async refreshToken(body: { refresh_token: string }): Promise<{
    message: string;
    access_token: string;
    refresh_token: string;
  }> {
    const cachedRefreshToken: { sub: string; email: string } =
      await this.redis.get(`refresh:${body.refresh_token}`);

    if (!cachedRefreshToken) {
      throw new UnauthorizedException('This Token is invalid or expired.');
    }

    const { sub: userId, email } = cachedRefreshToken;

    const { access_token, refresh_token } = await this.signToken(userId, email);

    return { message: 'Refresh Successful', access_token, refresh_token };
  }

  async revokeRefreshToken(body: { refresh_token: string }): Promise<{
    message: string;
  }> {
    const { refresh_token } = body;
    await this.redis.del(`refresh:${refresh_token}`);

    return { message: 'Revoke Successful' };
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRY'),
      secret: this.config.get('JWT_SECRET'),
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('REFRESH_JWT_EXPIRY'),
      secret: this.config.get('REFRESH_JWT_SECRET'),
    });

    // expire token in redis after token refresh expiration days
    const expiry_in_days: number = Number(
      this.config.get('REFRESH_JWT_EXPIRY').split('d')[0],
    );

    await this.redis.set(
      `refresh:${refresh_token}`,
      payload,
      expiry_in_days * 24 * 60 * 60 * 1000,
    );

    return { access_token, refresh_token };
  }
}
