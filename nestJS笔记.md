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
