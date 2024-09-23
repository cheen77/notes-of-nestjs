import { DataSourceOptions, DataSource } from 'typeorm'
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql', //数据库类型
  username: 'root', //账号
  password: 'alice', //密码
  host: 'localhost', //host
  port: 3306, //
  database: 'crud', //库名
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
