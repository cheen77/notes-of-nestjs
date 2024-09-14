import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'

// 在upload  Module 使用MulterModule register注册存放图片的目录
import { MulterModule } from '@nestjs/platform-express'

import { diskStorage } from 'multer'
import { join, extname } from 'path'

@Module({
  // 在upload  Module 使用MulterModule register注册存放图片的目录
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../uploadImages'),
        filename: (req, file, callback) => {
          const filename = `${new Date().getTime() + extname(file.originalname)}`
          return callback(null, filename)
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
