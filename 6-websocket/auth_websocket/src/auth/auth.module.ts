import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGateway } from './auth.gateway';
import { LoggerModule } from 'src/logger-1/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [AuthGateway, AuthService,],
})
export class AuthModule { }
