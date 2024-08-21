import axios from "axios";

const Get = (url: string): MethodDecorator => {
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
