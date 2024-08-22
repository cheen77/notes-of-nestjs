## 1.综述

`Nestjs` 是一个用于构建高效可扩展的一个基于 `Node js` 服务端 应用程序开发框架

并且完全支持`typeScript`结合了`AOP`面向切面的编程方式

nestjs 还是一个 `spring MVC` 的风格 其中有`依赖注入`, `IOC 控制反转` 都是借鉴了 Angualr

nestjs 的底层代码运用了 express 和 Fastify 在他们的基础上提供了一定程度的抽象，同时也将其 API 直接暴露给开发人员。这样可以轻松使用每个平台的无数第三方模块

nestjs 中文文档 https://docs.nestjs.cn/10/introduction
nestjs 英文文档 https://nestjs.com/

## 2.前置知识

### AOP 面向切面编程

是一种用于将横切关注点从主要业务逻辑中分离出来的编程范式。AOP 的核心思想是通过一种称为 "切面"（Aspect）的结构化模块来模块化这些横切关注点，然后将它们应用到整个应用程序中。切面是一个包含了横切逻辑的模块，它描述了在哪里以及何时将这些横切关注点应用到代码中。

### IoC 控制反转

Inversion of Control 字面意思是控制反转，具体定义是高层模块不应该依赖低层模块，二者都应该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象。

### DI 依赖注入

依赖注入（Dependency Injection）指创建对象的过程由框架自动完成，a 对象在使用 b 对象，b 对象使用 c 对象，a 对象只需要使用 b 对象，而不需要了解 b 对象怎么怎么样创建出 c 对象。达到逻辑解耦

```
// npm install ts-node -g 可以在控制台打印ts文件
// 依赖注入

class A {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class B {
  name: A;
  age: number;
  constructor(age: number) {
    this.age = age;
    this.name = new A("CHEN");
  }
}

const c = new B(18);

console.log("c", c);

// 我们可以看到，B 中代码的实现是需要依赖 A 的，两者的代码耦合度非常高。当两者之间的业务逻辑复杂程度增加的情况下，维护成本与代码可读性都会随着增加，并且很难再多引入额外的模块进行功能拓展。

// 为了解决这个问题可以增加一个中间键实现解耦

class A1 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class B1 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

//中间件用于解耦
class MiddleKey {
  modeuls: any;
  constructor() {
    this.modeuls = {};
  }
  provide(key: string, value: any) {
    this.modeuls[key] = value;
  }
  get(key: string) {
    return this.modeuls[key];
  }
}

// 将各个模块注册到中间键中
const middleKey = new MiddleKey();
middleKey.provide("A", new A1("CHEN"));
middleKey.provide("B", new B1("LI"));

class C {
  name1: string;
  name2: string;
  constructor(middleKey: MiddleKey) {
    this.name1 = middleKey.get("A");
    this.name2 = middleKey.get("B");
  }
}

// 取出对应模块
const c2 = new C(middleKey);

console.log("c2", c2);

```

### 装饰器

#### 1. 什么是装饰器?

装饰器是一种`特殊类型的声明`

它能够被附加到`类声明`，`方法`，`属性`或`参数`上，可以修改类的行为。

装饰器使用`@expression`这种形式，expression 求值后必须为一个函数，它会在运行时当作函数被调用，被装饰的声明信息做为参数传入。

类似于 `Java` 中的`注解`

**装饰器需要开启**

```
npm install ts-node -g
npm install typescript -g
tsc --init
```

需要在 `tsconfig.json `中配置` compilerOptions` 选项中添加`"experimentalDecorators": true`

#### 装饰器类型

##### 1.类装饰器

类装饰器表达式会在运行时当作函数被调用，
返回一个参数 1.原形对象

主要是通过@符号添加装饰器
他会自动把 class 的构造函数传入到装饰器的第一个参数 target
然后通过 prototype 可以自定义添加属性和方法

```

/**
 * decotators
 * @param target 类的原型对象
 */
const decotators: ClassDecorator = (target: any) => {
  console.log("target", target);
  target.prototype.name = "chen";
};

@decotators
class Person {
  name: any;
  constructor() {}
}

const p = new Person();
console.log("p", p.name);


```

##### 2.属性装饰器

属性装饰器表达式会在运行时当作函数被调用，
返回两个参数: 1.原形对象 2.属性的名称

```
/**
 *decotators2
 * @param target 类的原型对象
 * @param key  属性名
 */
const decotators2: PropertyDecorator = (target: any, key: string | symbol) => {
  console.log("target2", target, "key2", key);
};

class Person2 {
  @decotators2
  name: string; // 属性名
  @decotators2
  age: number;
  constructor() {
    this.name = "chen 1";
    this.age = 26;
  }
}
```

##### 3.参数装饰器

参数装饰器表达式会在运行时当作函数被调用，
返回三个参数: 1.原形对象 2.方法的名称 3.参数在函数参数列表中的索引

```
const decotators3: ParameterDecorator = (
  target: any,
  key: string | symbol | undefined,
  index: number
) => {
  console.log("target", target, "key", key, "index", index);
};

class Person3 {
  name: string; // 属性名
  age: number;
  constructor() {
    this.name = "chen 1";
    this.age = 26;
  }

  getName(name: string, @decotators3 age: number) {
    return this.name;
  }
}
```

##### 4.方法装饰器

参数装饰器表达式会在运行时当作函数被调用，
返回三个参数: 1.原形对象 2.方法的名称 3.属性描述符
function 方法 对应 value
可写对应 writable
可枚举对应 enumerable
可配置对应 configurable

```
const decotators4: MethodDecorator = (
  target: any,
  key: string | symbol,
  descriptor: PropertyDescriptor
) => {
  console.log("target", target, "key", key, "descriptor", descriptor);
};

class Person4 {
  name: string; // 属性名
  age: number;
  constructor() {
    this.name = "chen 1";
    this.age = 26;
  }
  @decotators4
  getName(name: string, age: number) {
    return this.name;
  }
}
```

### 装饰器实现一个 GET 请求

```
npm install axios -S
```

定义控制器 Controller

```
class Controller {
    constructor() {

    }
    getList () {

    }

}
```

```
import axios from "axios";

const Get = (url: string): MethodDecorator => { //类似于高阶函数 柯里化处理
  return (target, key, descriptor: PropertyDescriptor) => {
    console.log("target", target, "key", key, "descriptor", descriptor.value);
    const fnc = descriptor.value; //拿到对应的function
    axios
      .get(url)
      .then((res: any) => {
        fnc(res, {
          status: 200,
        });
      })
      .catch((e: any) => {
        fnc(e, {
          status: 500,
        });
      });
  };
};

class Controller {
  constructor() {}
  @Get("https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10")
  getList(res: any, status: any) {
    console.log("res", res, status);
  }
}

```

**函数柯里化**

柯里化（Currying）是一种关于函数的高阶技术。
柯里化是一种函数的转换，它是指将一个函数从可调用的 f(a, b, c) 转换为可调用的 f(a)(b)(c)。
柯里化不会调用函数。它只是对函数进行转换。

看一个例子
我们将创建一个辅助函数 curry(f)，该函数将对两个参数的函数 f 执行柯里化。
换句话说，对于两个参数的函数 f(a, b) 执行 curry(f) 会将其转换为以 f(a)(b) 形式运行的函数：

```
// 柯里化
function curry(f: any) {
  // curry(f) 执行柯里化转换
  return function (a: any) {
    return function (b: any) {
      return f(a, b);
    };
  };
}

// 用法
function sum(a: any, b: any) {
  return a + b;
}

let curriedSum = curry(sum);

console.log(curriedSum(1)(2)); // 3
```

## 3.nestjs-cli

```
node版本 >= 16

$ npm i -g @nestjs/cli
$ nest new project-name
```

```
src
 ├── app.controller.spec.ts 对于基本控制器的单元测试样例
 ├── app.controller.ts      控制层,这里主要是写路由相关代码以及处理前端传来的一些参数
 ├── app.module.ts          组织应用程序中的许多功能,如控制器、服务以及可以导入其他模块等
 ├── app.service.ts         业务层,在这里写一些与业务相关的逻辑。比如对数据库的 CRUD
 └── main.ts                整个程序的入口文件
```

## 4. nestjs cli 常用命令

```
nest --help 可以查看nestjs所有的命令

      │  name         │ alias       │ description                                  │
      │ application   │ application │ Generate a new application workspace         │
      │ class         │ cl          │ Generate a new class                         │
      │ configuration │ config      │ Generate a CLI configuration file            │
      │ controller    │ co          │ Generate a controller declaration            │
      │ decorator     │ d           │ Generate a custom decorator                  │
      │ filter        │ f           │ Generate a filter declaration                │
      │ gateway       │ ga          │ Generate a gateway declaration               │
      │ guard         │ gu          │ Generate a guard declaration                 │
      │ interceptor   │ itc         │ Generate an interceptor declaration          │
      │ interface     │ itf         │ Generate an interface                        │
      │ library       │ lib         │ Generate a new library within a monorepo     │
      │ middleware    │ mi          │ Generate a middleware declaration            │
      │ module        │ mo          │ Generate a module declaration                │
      │ pipe          │ pi          │ Generate a pipe declaration                  │
      │ provider      │ pr          │ Generate a provider declaration              │
      │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
      │ resource      │ res         │ Generate a new CRUD resource                 │
      │ service       │ s           │ Generate a service declaration               │
      │ sub-app       │ app         │ Generate a new application within a monorepo │



```

### 生成一个 user 模块

#### 1.生成 controller.ts

```
nest g co user  // g:generate co:controller简写

CREATE src/user/user.controller.ts (101 bytes)
CREATE src/user/user.controller.spec.ts (496 bytes)
UPDATE src/app.module.ts (332 bytes)

这样会生成一个文件在src/user/user.controller.ts
```

#### 2.生成 module.ts

```
nest g mo user

UPDATE src/app.module.ts (391 bytes)
```

#### 3.生成 service.ts

```
nest g s user

CREATE src/user/user.service.ts (92 bytes)
CREATE src/user/user.service.spec.ts (464 bytes)
UPDATE src/user/user.module.ts (159 bytes)
```

### 一键生成 CURD

```
 nest g resource user2

 ? What transport layer do you use? (Use arrow keys)
> REST API
  GraphQL (code first)
  GraphQL (schema first)
  Microservice (non-HTTP)
  WebSockets

  ? What transport layer do you use? REST API
  ? Would you like to generate CRUD entry points? (Y/n) y

  CREATE src/user2/user2.controller.ts (938 bytes)
  CREATE src/user2/user2.controller.spec.ts (586 bytes)
  CREATE src/user2/user2.module.ts (257 bytes)
  CREATE src/user2/user2.service.ts (647 bytes)
  CREATE src/user2/user2.service.spec.ts (471 bytes)
  CREATE src/user2/dto/create-user2.dto.ts (32 bytes)
  CREATE src/user2/dto/update-user2.dto.ts (177 bytes)
  CREATE src/user2/entities/user2.entity.ts (23 bytes)
  UPDATE package.json (2057 bytes)
  UPDATE src/app.module.ts (456 bytes)
✔ Packages installed successfully.
```

## 5. RESTful 风格设计

#### 定义

RESTful 是一种风格，在 RESTful 中，一切都被认为是资源，每个资源有对应的 URL 标识.

不是标准也不是协议，只是一种风格。当然你也可以不按照他的风格去写。

#### 1.接口 url

###### 传统接口

http://localhost:8080/api/get_list?id=1

http://localhost:8080/api/delete_list?id=1

http://localhost:8080/api/update_list?id=1

##### RESTful 接口

http://localhost:8080/api/get_list/1 查询 删除 更新

RESTful 风格一个接口就会完成 增删改差 他是通过不同的请求方式来区分的

查询 GET

提交 POST

更新 PUT PATCH

删除 DELETE

#### 2.RESTful 版本控制

一共有三种我们一般用第一种 更加语义化

URI Versioning 版本将在请求的 URI 中传递（默认）
Header Versioning 自定义请求标头将指定版本
Media Type Versioning 请求的 Accept 标头将指定版本

main.ts

```
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  })
  await app.listen(3000);
}
bootstrap();
```

然后在 user.controller 配置版本

Controller 变成一个对象 通过 version 配置版本

```
import { Controller, Get, Post, Body, Patch, Param, Delete, Version } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  path:"user",
  version:'1'
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @Version('1')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  localhost:3000/v1/user
```

#### 3.Code 码规范

200 OK

304 Not Modified 协商缓存了

400 Bad Request 参数错误

401 Unauthorized token 错误

403 Forbidden referer origin 验证失败

404 Not Found 接口不存在

500 Internal Server Error 服务端错误

502 Bad Gateway 上游接口有问题或者服务器问题

## 6.nestjs 控制器

控制器负责处理传入的请求和向客户端返回响应。

### 参数装饰器

nestjs 提供了方法参数装饰器 用来帮助我们快速获取参数

```

@Request(),@Req()	              req
@Response(),@Res()	              res
@Next()	                              next
@Session()	                      req.session
@Param(key?: string)	              req.params/req.params[key]
@Body(key?: string)	              req.body/req.body[key]
@Query(key?: string)                  req.query/req.query[key]
@Headers(name?: string)	              req.headers/req.headers[name]
@Ip()	                              req.ip
@HostParam()	                      req.hosts
@HttpCode
```

#### 1.获取 get 请求传参

可以使用 Request 装饰器 或者 Query 装饰器 跟 express 完全一样

```
import { Controller, Get, Req, Request, Query, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { DocService } from './doc.service'

@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  //1. 可以通过 @Request()或者@Req req 获取请求对象 req.query获取请求参数
  @Get('get1') //前端通过doc/get1?name=chen&age=18访问
  find(@Req() req) {
    // console.log('req', req.query)

    return {
      code: 200,
      success: 'ok',
      data: req.query,
    }
  }

  //2. 可以通过 @Query
  @Get('get2') //前端通过doc/get2?name=chen&age=18访问
  find2(@Query() query) {
    console.log('query', query)
    return {
      code: 200,
      success: 'ok',
      data: query,
    }
  }

    //3. 还可以直接获取key
  @Get('get2') //前端通过doc/get2?name=chen&age=18访问
  find3(@Query("name") query) {
    console.log('query', query) //chen
    return {
      code: 200,
      success: 'ok',
      data: query,
    }
  }
}

```

#### 2.post 获取参数

可以使用 Request 装饰器 或者 Body 装饰器 跟 express 完全一样

```
//1. 可以通过 @Request()或者@Req req 获取请求对象 req.body获取请求参数

  @Post('post1')
  create(@Req() req) {
    console.log('req', req.body)

    return {
      code: 200,
      success: 'ok',
      data: req.body,
    }
  }

  //  2.可以通过 @Body直接获取

  @Post('post2')
  create2(@Body() body) {
    console.log('body', body)

    return {
      code: 200,
      success: 'ok',
      data: body,
    }
  }

    // 3.还可以直接获取key
  @Post('post3')
  create3(@Body('name') body) {
    console.log('body', body) // chen

    return {
      code: 200,
      success: 'ok',
      data: body,
    }
  }
```

#### 3.动态路由

可以使用 Request 装饰器 或者 Param 装饰器 跟 express 完全一样

```type
  //  动态路由

  // 1.通过 @Req  req.params获取
  @Get('get1/:id')
  findOne(@Req() req) {
    console.log('params', req.params)
    return {
      code: 200,
      success: 'ok',
      data: req.params,
    }
  }

  // 2.通过 @Param  params获取
  @Get('get2/:id')
  findOne1(@Param() params) {
    console.log('params', params)
    return {
      code: 200,
      success: 'ok',
      data: params,
    }
  }
```

#### 4.读取 header 信息

在调试工具随便加了一个 cookie

```
  // 获取header信息
  @Get(':id')
  findId(@Headers() header) {
    console.log('header', header)

    return {
      code: 200,
      success: 'ok',
      data: header,
    }
  }

```

#### 5.状态码

使用 HttpCode 装饰器 控制接口返回的状态码

```typescript
  // 状态码
  @Get('code/:id')
  @HttpCode(500)
  findId2(@Headers() header) {
    console.log('header', header)

    return {
      code: 200,
      success: 'ok',
      data: header,
    }
  }
```

## 7.nestjs 提供者

`Providers` 是 `Nest` 的一个基本概念。许多基本的` Nest` 类可能被视为 `provider - service`, `repository`, `factory`, `helper `等等。 他们都可以通过 `constructor `注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 `Nest` 运行时系统。 `Provider` 只是一个用`@Injectable()`装饰器注释的类。

### 1.基本用法

module 引入 service 在 providers 注入

```
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { User2Module } from './user2/user2.module'
import { DocModule } from './doc/doc.module'

@Module({
  imports: [UserModule, User2Module, DocModule],
  controllers: [AppController, UserController],
  providers: [AppService], //通过Module装饰器注入中间键中
})
export class AppModule {}
```

### 2.service 第二种用法(自定义名称)

```
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { User2Module } from './user2/user2.module'
import { DocModule } from './doc/doc.module'

@Module({
  imports: [UserModule, User2Module, DocModule],
  controllers: [AppController, UserController],
   providers: [{
    provide: "AppService",
    useClass: AppService
  }], //通过Module装饰器注入中间键中
})
export class AppModule {}

```

可以通过改写 provide 字段和 useClass 字段来自定义

比如

```

module.ts:

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [{
    provide: "aaa",
    useClass: UserService
  }]
})
export class UserModule { }

//自定义名称之后 需要用对应的Inject 取 不然会找不到的
controller.ts:

import { Controller, Get } from '@nestjs/common';
import { UserService } from './app.service';

@Controller()
export class AppController {
  constructor( @Inject("aaa") private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }
}

```

### 3.自定义注入值

通过 useValue

```
module.ts:

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [{
    provide: "aaa",
    useClass: UserService
  }, {
    provide: "JD",
    useValue: ['TB', 'PDD', 'JD']
  }]
})
export class UserModule { }

controller.ts:

import { Controller, Get } from '@nestjs/common';
import { UserService } from './app.service';

@Controller()
export class AppController {
  constructor( @Inject("JD") private readonly shopList: string[]) {}

  @Get()
  getHello(): string {
    return this.shopList;
  }
}

```

### 4.工厂模式

如果服务 之间有相互的依赖 或者逻辑处理 可以使用 useFactory

```
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserService2 } from './user.service2';
import { UserService3 } from './user.service3';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [{
    provide: "aaa",
    useClass: UserService
  }, {
    provide: "JD",
    useValue: ['TB', 'PDD', 'JD']
  },
    UserService2,
  {
    provide: "Test",
    inject: [UserService2],
    useFactory(UserService2: UserService2) {
      return new UserService3(UserService2)
    }
  }
  ]
})
export class UserModule { }
```

### 4.异步模式

useFactory 返回一个 promise 或者其他异步操作

```
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserService2 } from './user.service2';
import { UserService3 } from './user.service3';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [{
    provide: "Xiaoman",
    useClass: UserService
  }, {
    provide: "JD",
    useValue: ['TB', 'PDD', 'JD']
  },
    UserService2,
  {
    provide: "Test",
    inject: [UserService2],
    useFactory(UserService2: UserService2) {
      return new UserService3(UserService2)
    }
  },
  {
    provide: "sync",
    async useFactory() {
      return await  new Promise((r) => {
        setTimeout(() => {
          r('sync')
        }, 3000)
      })
    }
  }
  ]
})
export class UserModule { }
```

## 8.nestjs 模块

模块是具有`@Module()`装饰器的类。`@Module()`装饰器提供了元数据，`Nest `用它来组织应用程序结构。

每个 `Nest` 应用程序至少有一个模块，即根模块。根模块是` Nest` 开始安排应用程序树的地方。事实上，根模块可能是应用程序中唯一的模块，特别是当应用程序很小时，但是对于大型程序来说这是没有意义的。在大多数情况下，您将拥有多个模块，每个模块都有一组紧密相关的功能

`@Module()` 装饰器接受一个描述模块属性的对象：

```
providers	由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
controllers	必须创建的一组控制器
imports	        导入模块的列表，这些模块导出了此模块中所需提供者
exports	        由本模块提供并应在其他模块中可用的提供者的子集。
```

默认情况下，该模块封装提供程序。这意味着无法注入既不是当前模块的直接组成部分，也不是从导入的模块导出的提供程序。因此，您可以将从模块导出的提供程序视为模块的公共接口或 API。

### 共享模块

在 Nest 中，默认情况下，模块是单例，因此您可以轻松地在多个模块之间共享同一个提供者实例。

实际上，每个模块都是一个共享模块。一旦创建就能被任意模块重复使用。假设我们将在几个模块之间共享 CatsService 实例。 我们需要把 CatsService 放到 exports 数组中，如下所示：

```
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

现在，每个导入 CatsModule 的模块都可以访问 CatsService ，并且它们将共享相同的 CatsService 实例。

### 全局模块

如果你不得不在任何地方导入相同的模块，那可能很烦人。在 Angular 中，提供者是在全局范围内注册的。一旦定义，他们到处可用。另一方面，Nest 将提供者封装在模块范围内。您无法在其他地方使用模块的提供者而不导入他们。但是有时候，你可能只想提供一组随时可用的东西 - 例如：helper，数据库连接等等。这就是为什么你能够使模块成为全局模块。

`@Global` 装饰器使模块成为全局作用域。 全局模块应该只注册一次，最好由根或核心模块注册。 在上面的例子中，`CatsService` 组件将无处不在，而想要使用 `CatsService` 的模块则不需要在 `imports` 数组中导入 `CatsModule`。

```
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}

```

### 动态模块

动态模块主要就是为了给模块传递参数 可以给该模块添加一个静态方法 用来接受参数

```
import { Module, DynamicModule, Global } from '@nestjs/common'



interface Options {
    path: string
}

@Global()
@Module({

})
export class ConfigModule {
    static forRoot(options: Options): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: "Config",
                    useValue: { baseApi: "/api" + options.path }
                }
            ],
            exports: [
                {
                    provide: "Config",
                    useValue: { baseApi: "/api" + options.path }
                }
            ]
        }
    }
}

app.module.ts:

@Module({
  imports: [ConfigModule.forRoot({ path: "/api/v1" })],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
```
