import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { StringValue } from 'ms';
import {
  registerDto,
  emailVerificationDto,
  passwordResetDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password_hash === password) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async userRegistrationValidation(user: registerDto): Promise<any> {
    // check if password match
    if (user.password !== user.password_confirm) {
      throw new BadRequestException('Password do not match');
    }
    // check if user is already registered
    const registeredMail = await this.usersService.findOne(user.email);
    if (registeredMail) {
      throw new BadRequestException('Email is already registered');
    }
  }

  async generateToken(payload: any, duration: StringValue): Promise<string> {
    return await this.jwtService.signAsync(payload, { expiresIn: duration });
  }

  async sendEmailVerification(payload: { email: string }): Promise<string> {
    // TODO: normally this would send email verification, but for this purpose, only return token
    return await this.generateToken(payload, '15m');
  }

  async registerUser(user: registerDto): Promise<any> {
    await this.userRegistrationValidation(user);
    const token = await this.sendEmailVerification({ email: user.email });

    const completed = {
      email_verified: false,
      created_at: new Date(),
      email: user.email,
      password_hash: user.password,
    } as User;
    await this.usersService.addOne(completed);

    return {
      statusCode: 201,
      message: `Verification token for email ${user.email}`,
      token: token,
    };
  }

  async verifyEmail(query: emailVerificationDto): Promise<any> {
    const foundUser = await this.getUserFromToken(query.token);
    if (foundUser) {
      if (foundUser.email_verified) {
        throw new BadRequestException('Email already verified');
      }
      await this.usersService.save({
        ...foundUser,
        email_verified: true,
      });
      return { statusCode: 200, message: 'Email verification successful' };
    }
  }

  async getUserFromToken(token: string): Promise<User | null> {
    let decoded: any;
    let foundUser: any;
    // check if already verified
    try {
      decoded = await this.jwtService.verify(token);
      foundUser = await this.usersService.findOne(decoded?.email);
    } catch {
      throw new BadRequestException('Invalid or expired link');
    }
    return foundUser;
  }

  async passwordReset(body: passwordResetDto): Promise<any> {
    const foundUser = await this.getUserFromToken(body.token);
    // check if curent password mismatch with password input
    if (body.current_password != foundUser?.password_hash) {
      throw new BadRequestException('wrong current password');
    }

    await this.usersService.save({
      ...foundUser,
      password_hash: body.new_password,
    });
    return { statusCode: 200, message: 'Your password changed successfully' };
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.generateToken(payload, '1h'),
    };
  }
}
