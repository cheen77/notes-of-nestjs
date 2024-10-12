import { ConsoleLogger, ConsoleLoggerOptions, Injectable } from '@nestjs/common'
import { config, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import type { Logger as WinstonLogger } from 'winston';
import { ConfigService } from '@nestjs/config'

/**
 * 在日志系统中的常见日志级别（从高到低）：
  error: 记录错误信息，程序遇到无法继续的情况。
  warn: 记录警告信息，程序可以继续执行，但可能存在潜在问题。
  info: 记录常规信息，表明程序运行正常，输出重要状态或事件。
  debug: 记录调试信息，输出一些供开发人员调试时使用的较详细信息。
  verbose: 记录非常详细的调试信息，通常是所有日志级别中最详细的。
 */
export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    VERBOSE = 'verbose',
}
@Injectable()
export class MyLogger extends ConsoleLogger {
    private winstonLogger: WinstonLogger;


    constructor(
        context: string,
        options: ConsoleLoggerOptions, //NestJS 框架会自动处理这些实例，只用这样写就行了
    ) {
        super(context, options);// 调用父类的构造函数,子类的构造函数中必须先调用父类的构造函数，以确保父类的属性和方法能够被正确初始化。
        this.initWinston()
    }


    protected initWinston(): void {
        this.winstonLogger = createLogger({
            levels: config.npm.levels,//定义日志级别，采用Winston的npm级别配置error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
            format: format.combine(
                format.errors({ stack: true }),//错误日志包含堆栈信息
                format.timestamp(),//给日志加时间戳
                format.json(),//json格式输出日志
            ),
            transports: [// 指定日志的输出方式
                new transports.DailyRotateFile({
                    level: 'silly',//当 level 是 silly silly 及以上的日志会被记录
                    filename: 'logs/app.%DATE%.log', //日志文件路径，%DATE%是一个占位符
                    datePattern: 'YYYY-MM-DD',//指定日期格式
                    maxSize: '20m',//日志最大内存20mb，超出此旧日志自动删除
                    format: format.combine(format.timestamp(), format.json()),//这个 DailyRotateFile 的格式再一次组合了时间戳和 JSON 输出，以确保每一条日志都带有时间信息并以 JSON 格式存储。
                    //日志文件还没有达到触发轮换的条件（比如文件大小没有达到 maxSize），则 app.json 不会生成
                    auditFile: 'logs/.audit/app.json',//用于记录文件轮换的元数据。winston-daily-rotate-file 会使用 auditFile 来跟踪文件轮换情况，以保证日志文件的自动管理。
                }),


                // 单独把error的日志领出来
                new transports.DailyRotateFile({
                    level: LogLevel.ERROR,//只记录 error 级别的日志
                    filename: 'logs/app-error.%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '20m',
                    format: format.combine(format.timestamp(), format.json()),
                    //只要发生错误，日志就会写入。因此，日志轮换容易被触发。
                    auditFile: 'logs/.audit/app-error.json',
                })
            ]
        })
    }


    verbose(message: any, context?: string): void {
        super.verbose.apply(this, [message, context])

        this.winstonLogger.log(LogLevel.VERBOSE, message, { context })
    }

    debug(message: any, context?: string): void {
        super.debug.apply(this, [message, context])

        this.winstonLogger.log(LogLevel.DEBUG, message, { context })
    }

    log(message: any, context?: string): void {
        super.log.apply(this, [message, context])

        this.winstonLogger.log(LogLevel.INFO, message, { context })
    }

    warn(message: any, context?: string): void {
        super.warn.apply(this, [message, context])

        this.winstonLogger.log(LogLevel.WARN, message)
    }

    error(message: any, stack?: string, context?: string): void {
        super.error.apply(this, [message, stack, context])

        const hasStack = !!context
        this.winstonLogger.log(LogLevel.ERROR, {
            context: hasStack ? context : stack,
            message: hasStack ? new Error(message) : message,
        })
    }
}
