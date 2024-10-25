import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoginDto, SignupDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
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

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('JWT_SECRET'),
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token, refresh_token };
  }
}
