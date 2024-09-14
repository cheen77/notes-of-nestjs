import { IsString, IsInt, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateListDto {
    @ApiProperty({ description: '姓名', example: "Bob" })
    @IsNotEmpty()//验证是否为空
    @IsString() //是否为字符串
    @MinLength(1)
    @MaxLength(3)
    name: string;

    @ApiProperty({ description: '年龄', example: 18, })
    @IsNotEmpty()
    @IsInt()//是否为整数
    age: number;


}
