import { Module } from '@nestjs/common';

// controllers
import { AppController } from './app.controller';

// services
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

// modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, UsersService, AuthService],
})
export class AppModule { }
