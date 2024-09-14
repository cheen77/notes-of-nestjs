import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from "@nestjs/common"
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
// 手写一个 ValidationPipe
@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }
        // 它的作用是将普通的 JavaScript 对象转换为特定类的实例（就是 DTO 类的实例）。
        // 尽管 value 可能看起来已经是 DTO 对象，但实际上它只是一个普通的对象，没有任何与 DTO 类相关的方法或验证规则。
        // 确保传入的数据被转换为特定类的实例，从而支持类验证和类型安全。
        const DTO = plainToInstance(metadata.metatype, value);
        console.log('value', value, "DTO", DTO);
        // 通过 validate 验证 DTO 返回一个promise 的错误信息 如果有错误抛出
        const errors = await validate(DTO);  //错误的arr
        console.log("errors", errors);

        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }
        return value;
    }
    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}



