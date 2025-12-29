import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Body,
  Query,
  Put,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import {
  registerDto,
  emailVerificationDto,
  passwordResetDto,
  generateTokenDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: registerDto) {
    return await this.authService.registerUser(body);
  }

  @Put('/verifyEmail')
  async verifyRegisteredEmail(@Query() query: emailVerificationDto) {
    return await this.authService.verifyEmail(query);
  }

  @Get('/getToken')
  async getToken(@Query() query: generateTokenDto) {
    return this.authService.generateToken({ email: query.email }, '1h');
  }

  @Put('/passwordReset')
  async resetPassword(@Body() body: passwordResetDto) {
    return await this.authService.passwordReset(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return await this.authService.login(req?.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/logout')
  async logout(@Request() req) {
    return await req.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req?.user;
  }
}
