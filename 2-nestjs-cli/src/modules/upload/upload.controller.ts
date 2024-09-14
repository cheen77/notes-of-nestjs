// UseInterceptors, UploadedFile
import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { UploadService } from './upload.service'
//
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileUploadDto } from './dto/file.dto';


@Controller('upload')
@ApiTags("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  // upload/album
  @Post('album')
  @UseInterceptors(FileInterceptor('file')) //与前端接口中字段匹配

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '单个图片上传',
    type: FileUploadDto,
  })
  uploadFile(@UploadedFile() file: FileUploadDto) {
    //@UploadedFile()  装饰器从  request  中取出  file
    console.log(file)

    return {
      code: 200,
      data: file,
    }
  }
}
