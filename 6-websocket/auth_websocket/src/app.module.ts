import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger-1/logger.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
    }),
    AuthModule,
    LoggerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
