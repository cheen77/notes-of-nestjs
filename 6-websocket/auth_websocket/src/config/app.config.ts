import { registerAs } from '@nestjs/config'

export const appRegToken = 'app'
//registerAs: NestJS 的一个函数，用来为配置定义一个命名空间或 token，使得配置可以通过 ConfigService 来获取。
export const AppConfig = registerAs(appRegToken, () => ({
    port: process.env.PORT,
}));