---
title: 'TypeScript 的结构类型原则'
date: '2024-6-19'
category: '前端'
tags: ['typescript']
detail: '只要对象 B 满足对象 A 的结构特征，TS 就认为对象 B 兼容对象 A 的类型，这称为“结构类型”原则。'
---

# TypeScript 的结构类型原则

## 结构类型简介

只要对象 B 满足对象 A 的结构特征，TypeScript 就认为对象 B 兼容对象 A 的类型，这称为“结构类型”原则（structural typing or duck typing）。

```ts
type A = {
  x: number
}

type B = {
  x: number
  y: number
}
```

上面示例中，对象 A 只有一个属性 `x`，类型为 `number`。对象 B 满足这个特征，因此兼容对象 A，只要可以使用 A 的地方，就可以使用 B。

```ts
const B = {
  x: 1,
  y: 1
}

const A: { x: number } = B // 正确
```

上面示例中，A 和 B 并不是同一个类型，但是 B 可以赋值给 A，因为 B 满足 A 的结构特征。

根据“结构类型”原则，TypeScript 检查某个值是否符合指定类型时，并不是检查这个值的类型名（即“名义类型”），而是检查这个值的结构是否符合要求（即“结构类型”）。

TypeScript 之所以这样设计，是为了符合 JavaScript 的行为。JavaScript 并不关心对象是否严格相似，只要某个对象具有所要求的的属性，就可以正确运行。

如果类型 B 可以赋值给类型 A，TypeScript 就认为 B 是 A 的子类型（subtyping），A 是 B 的父类型。子类型满足父类型的所有结构特征，同时还具有自己的特征。凡是可以使用父类型的地方，都可以使用子类型，即子类型兼容父类型。

这种设计有时会导致令人惊讶的结果。

```ts
type myObj = {
  x: number
  y: number
}

function getSum(obj: myObj) {
  let sum = 0

  for (const n of Object.keys(obj)) {
    const v = obj[n] // 报错
    sum += Math.abs(v)
  }

  return sum
}
```

上面示例中，函数 `getSum()` 要求传入参数的类型是 `myObj`，但是实际上所有与 `myObj` 兼容的对象都可以传入。这回导致 `const v = obj[n]` 这一行报错，原因是 `obj[n]` 取出的属性值不一定是数值（`number`），使得变量 `v` 的类型被推断为 `any`。如果项目设置为不允许变量类型推断为 `any`，代码就会报错。写成下面这样，就不会报错：

```ts
type MyObj = {
  x: number
  y: number
}

function getSum(obj: MyObj) {
  return Math.abs(obj.x) + Math.abs(obj.y)
}
```

上面示例就不会报错，因为函数体内部只使用了属性 `x` 和 `y`，这两个属性有明确的类型声明，保证 `obj.x` 和 `obj.y` 肯定是数值。虽然与 `MyObj` 兼容的任何对象都可以传入函数 `getSum()`，但是只要不使用其他属性，就不会有类型报错。

## 严格字面量检查

如果对象使用字面量表示，会触发 TypeScript 的严格字面量检查（strict object literal checking）。如果字面量的结构跟类型定义的不一样（比如多出了未定义的属性），就会报错。

```ts
const point: {
  x: number
  y: number
} = {
  x: 1,
  y: 1,
  z: 1 // 报错
}
```

上面示例中，等号右边是一个对象的字面量，这时会触发严格字面量检查。只要有类型声明中不存在的属性（本例是 `z`），就会导致报错。

如果等号右边不是字面量，而是一个变量，根据结构类型原则，是不会报错的。

```ts
const myPoint = {
  x: 1,
  y: 1,
  z: 1
}

const point: {
  x: number
  y: number
} = myPoint // 正确
```

上面示例中，等号右边是一个变量，就不会触发严格字面量检查，从而不报错。

TypeScript 对字面量进行严格检查的目的，主要是防止拼写错误。一般来说，字面量大多数来自手写，容易出现拼写错误，或者误用 API。

```ts
type Options = {
  title: string
  darkMode?: boolean
}

const obj: Options = {
  title: '我的网页',
  darkmode: true // 报错
}
```

上面示例中，属性 `darkMode` 拼写错了，成了 `darkmode`。如果没有严格字面量规则，就不会报错，因为 `darkMode` 是可选属性，根据结构类型原则，任何对象只要有 `title` 属性都认为符合 `Options` 类型。

规避严格字面量检查，可以使用中间变量。

```ts
let myOptions = {
  title: '我的网页',
  darkmode: true
}

const obj: Options = myOptions
```

上面示例中，创建了一个中间变量 `myOptions`，就不会触发严格字面量规则，因为这时变量 `obj` 的赋值，不属于直接字面量赋值。

如果你确认字面量没有错误，也可以使用类型断言规避严格字面量检查。

```ts
const obj: Options = {
  title: '我的网页',
  darkmode: true
} as Options
```

上面示例使用类型断言 `as Options`，告诉编辑器，字面量符合 Options 类型，就能规避这条规则。

如果允许字面量有多余属性，可以像下面这样在类型里面定义一个通用属性：

```ts
let x: {
  foo: number
  [x: string]: any
}

x = { foo: 1, baz: 2 } // Ok
```

上面示例中，变量 `x` 的类型声明里面，有一个属性的字符串索引（`[x: string]`），导致任何字符串属性名都是合法的。

由于严格字面量检查，字面量对象传入函数必须很小心，不能有多余的属性。

```ts
interface Point {
  x: number
  y: number
}

function computeDistance(point: Point) {
  /*...*/
}

computeDistance({ x: 1, y: 2, z: 3 }) // 报错
computeDistance({ x: 1, y: 2 }) // 正确
```

上面示例中，对象字面量传入函数 `computeDistance()` 时，不能有多余的属性，否则就通不过严格字面量检查。

编译器选项 `suppressExcessPropertyErrors`，可以关闭多余属性检查。下面是它在 tsconfig.json 文件里面的写法：

```json
{
  "compilerOptions": {
    "suppressExcessPropertyErrors": true
  }
}
```

## 最小可选属性规则

根据“结构类型”原则，如果一个对象的所有属性都是可选的，那么其他对象跟它都是结构类似的。

```ts
type Options = {
  a?: number
  b?: number
  c?: number
}
```

上面示例中，类型 `Options` 的所有属性都是可选的，所以它可以是一个空对象，也就意味着任意对象都满足 `Options` 的结构。

为了避免这种情况，TypeScript 2.4 引入了一个“最小可选属性规则”，也称为[弱类型检测](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html#weak-type-detection)（weak type detection）。

```ts
type Options = {
  a?: number
  b?: number
  c?: number
}

const opts = { d: 123 }

const obj: Options = opts // 报错
```

上面示例中，对象 `opts` 与类型 `Options` 没有共同属性，赋值给该类型的变量就会报错。

报错原因是，如果某个类型的所有属性都是可选的，那么该类型的对象必须至少存在一个可选属性，不能所有可选属性都不存在。这就叫做“最小可选属性规则”。

如果想规避这条规则，要么在类型里面增加一条索引属性（`[propName: string]: someType`），要么使用类型断言（`opts as Options`）。
