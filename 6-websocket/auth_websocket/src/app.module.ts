import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger-1/logger.module';
import config from './config'
@Module({
  imports: [
    ConfigModule.forRoot({
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      // 加载自定义配置方法文件或者自定义命名空间文件 ,文件可能多个，写一个文件专门导出配置
      load: [...Object.values(config)],
    }),
    AuthModule,
    LoggerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
