import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
async function bootstrap() {
  // 使用fastify
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // 全局路由前缀
  app.setGlobalPrefix("api", {
    //排除/路由
    exclude: ["/"],
  });
  // app.enableCors()
  await app.listen(3000);
}
bootstrap();
