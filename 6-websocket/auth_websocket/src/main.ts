import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from './logger-1/logger.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,//确保所有的日志都会被放入缓冲区
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  // const logger = new Logger('Main (main.ts)');
  await app.listen(port, '0.0.0.0', async () => {

    // 获取自定义的 MyLogger 单例
    const myLogger = app.get(MyLogger);

    app.useLogger(myLogger); //注册为全局的日志服务


    // 在启动时使用自定义 Logger 打印消息
    myLogger.log(`Application is starting  on port ${port}...`, 'Bootstrap');

    // logger.log(`Server running on port ${port} - - ${process.env.NODE_ENV}`);
  });



}
bootstrap();
