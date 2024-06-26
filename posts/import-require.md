---
title: 'JS 模块导入的不同方式和区别'
date: '2023-3-1'
category: '前端'
tags: ['javascript', 'module']
detail: '模块是一种可重用的代码块，JS 在导入模块时有两种常用的方式：import 和 require。'
---

# JS 模块导入的不同方式和区别

JavaScript 中，模块是一种可重用的代码块，它将一些代码打包成一个单独的单元，并且可以在其他代码中进行导入和使用。JavaScript 在导入模块时有两种常用的方式。

- `import` 是 ES6 引入的新特性，它允许你以声明的方式导入其他模块中的内容。

- `require` 是 Node.js 中的特性，它允许你使用一个函数来加载和导入其他模块。

## 导入方式

ESM 导入的方式是使用关键字 `import` 加上大括号（如果需要导入的内容是命令导出的话），再加上模块名的方式进行导入。例如：

```js
import { func1, func2 } from './myModule';
```

CommonJS 导入的方式是使用 `require` 函数，将需要导入的模块路径作为参数传递给该函数。例如：

```js
const myModule = require('./myModule');
```

## 文件类型

`import` 只能导入 ES6 模块或者使用 Babel 等工具转化为 ES6 模块的代码。而 `require` 则可以导入 CommonJS 模块、AMD 模块、UMD 模块以及 Node.js 内置模块等多种类型的模块。

## 变量提升

在 ES6 中，`import` 语句是静态执行的，它们在模块内部的顶层执行，并且在模块内部创建一个局部作用域。这意味着导入的变量只在模块内部可见，并且不会影响模块外部的变量。因此，使用 `import` 导入的变量是不会被提升的。

`require` 函数是动态执行的，这意味着它在运行时执行，并且不会在模块内部创建一个局部作用域。因此，使用 `require` 导入的变量是可以被提升的。

::: details 如何理解 import 语句是静态执行，而 require 函数是动态执行的？
理解这两个概念需要先了解它们的含义。

静态执行是指在编译阶段就能够确定其执行结果的代码执行方式。在 JavaScript 中，`import` 语句属于静态执行的代码，也就是说，当 JavaScript 引擎执行代码时，会在编译阶段对 `import` 语句进行静态分析，确定所导入的模块，并在运行时加载这些模块。

动态执行是指运行时才能确定其执行结果的代码执行方式。在 JavaScript 中，`require` 函数属于动态执行的代码，也就是说，当 JavaScript 引擎执行代码时，会在运行时动态地确定所需的模块，并加载这些模块。

因此，可以理解为：

- `imoprt` 语句是静态执行的，因为在编译阶段就能够确定所导入的模块，从而在运行时快速加载这些模块。

- `require` 函数是动态执行的，因为在运行时才能确定所需的模块，需要动态地加载这些模块。

值得注意的是，由于 `import` 语句是静态执行的，因此在代码中不能使用变量或表达式作为模块路径，只能使用字符串字面量。而 `require` 函数则可以接受变量或表达式作为模块路径，从而动态地确定所需的模块。
:::

## 导出方式

`import` 和 `require` 在导出方式上也有一些区别。

`import` 使用 ES6 的导出方式，可以使用命名导出和默认导出两种方式。例如：

```js
// 命名导出
export function func1() {}

// 默认导出
export default {}
```

而 `require` 使用 CommonJS 的导出方式，只能使用默认导出方式进行导出。例如：

```js
// 默认导出
module.exports = {};
```

`require` 除了可以使用 module.exports 导出模块，还可以使用 exports 对象。

实际上 exports 对象是 module.exports 的一个引用。当使用 exports 导出时，实际上是向 module.exports 对象添加属性和方法。

## 模块作用域

在 JavaScript 中，每个模块都有自己的作用域，模块之间的变量是相互隔离的，不会相互干扰。这也是模块化编程的一个主要特点。

在使用 `import` 导入模块时，实际上是在模块内部创建了一个指向被导入模块的引用，而不是直接复制模块中的变量。因此，当不同的文件使用 `import` 导入相同的模块时，它们实际上是共享了同一个模块实例，所以可以访问和修改同一个模块中的变量。

而在使用 `require` 导入模块时，实际上是将导入模块中的变量直接复制到（可以理解为浅拷贝）当前模块的作用域中。因此，当不同的文件中使用 `require` 导入相同的模块时，它们其实拥有各自独立的模块实例，彼此之间不会共享模块中的变量。

::: warning 注意
如果使用 `require` 导入的模块中含有可变状态的对象，那么在不同文件中修改该对象的变量会相互影响。这也是 `require` 在某些情况下会产生一些难以预测的副作用的原因之一。

而使用 `import` 导入的模块，由于是共享同一个模块实例，相对来说更容易管理和控制。
:::

如果使用 `require` 导入的模块中含有可变状态的对象，比如一个对象的属性值可以被修改，那么，当在不同的文件中修改这个对象中的变量时，由于 `require` 会将导入的模块中的变量直接复制到当前模块的作用域中，因此会导致这个对象的变量在不同文件中的值相互影响。

举个例子，假设有一个 `config.js` 模块，其中定义了一个可变的对象 `config`，并且在 `main.js` 和 `app.js` 两个文件中都使用 `require` 导入了该模块：

::: code-group
```js [config.js]
let config = {
  env: 'dev',
  port: 3000
}

module.exports = config;
```

```js [main.js]
const config = require('./config.js');

// 修改config对象的属性值
config.port = 4000;

console.log(`config.port in main.js: ${config.port}`);
```

```js [app.js]
const config = require('./config.js');

console.log(`config.port in app.js: ${config.port}`);
```
:::

当执行 `main.js` 和 `app.js` 时，它们都会通过 `require` 导入 `config.js` 模块，并且 `main.js` 中修改了 `config` 对象的 `port` 属性值。那么当 `app.js` 输出 `config.port` 时，它实际上输出的是被 `main.js` 修改后的 `port`，而不是 `config.js` 模块原本定义的值。

这就是因为 `require` 导入的模块中还有可变状态的对象或变量，在不同文件中修改该对象或变量会相互影响的原因。

::: danger 注意
这种影响是由于模块之间共享同一个对象的引用造成的，而不是模块本身的问题。因此，在编写模块时，需要谨慎处理可变状态的对象，尽量避免在不同模块之间共享同一个对象的引用，以免出现不可预测的副作用。
:::

为了避免这种影响，有以下几种方法：

- 使用 `import` 代替 `require`

  使用 `import` 导入模块时，不同文件导入同一个模块实际上是共享了同一个模块实例，因此可以避免 `require` 出现的副作用。

- 使用纯函数

  纯函数是指输入相同的参数，输出的结果也相同，并且不会对外部环境产生任何副作用的函数。如果在模块中使用纯函数，那么即使该模块中的变量被修改了，但由于纯函数不会产生副作用，因此在不同文件中调用该函数时，输出的结果也不会发生变化。

- 使用常量或不可变对象

  常量或不可变对象指的是一旦定义后就无法再被修改的值。如果在模块中使用常量或不可变对象，那么即使该模块中的变量被修改了，但由于常量或不可变对象无法修改，因此在不同文件中调用该变量时，其值也不会发生变化。

- 使用模块的副本

  可以通过在模块导出时返回一个副本，而不是直接返回模块内容的对象或变量。这样在不同文件中使用 `require` 导入该模块时，它们会得到不同的副本，而不是共享同一个模块实例。例如：

  ```js
  // config.js
  let config = {
    env: 'dev',
    port: 3000
  }

  module.exports = Object.assign({}, config);
  ```

  在导出时使用 `Object.assign` 方法返回 `config` 对象的一个副本，从而避免了不同文件之间共享同一个模块实例的副作用。

需要注意的是，这些方法并不是万无一失的，而是根据具体情况选用合适的方法来避免副作用。在编写模块时，需要考虑模块中的变量是否需要共享，是否可以被修改，以及模块在不同文件中被调用时可能产生的副作用等因素。

## import() 函数

`import` 和 `import()` 函数是 ES6 新增的两种语法，它们都用于在 JavaScript 中导入模块。虽然它们的作用相同，但它们的语法和用法不同。

`import()` 函数返回一个 Promise，可以在 Promise 的 `then` 方法中使用导入的模块。

与 `import` 不同，`import()` 可以在运行时根据需要动态地加载模块，而不需要在代码加载阶段就加载所有模块。

米格文件中调用 `import()` 函数时，都会创建一个新的 Promise，这个 Promise 表示将要加载并解析对应的模块，因此每个文件都会获得一个不同的模块实例。但是，实际上整个应用程序只有一个 `module.js` 模块的实例。

这是因为，当第一个文件调用 `import()` 函数时，会开始加载并解析 `module.js` 模块，当第二个文件调用 `import()` 函数时，由于该模块已经被加载并解析过了，因此不会重新加载并解析，而是直接返回已经加载并解析好的模块实例。这也意味着，如果在应用程序中多次调用 `import()` 函数来导入同一个模块，只有第一此调用会执行真正的加载和解析操作，后续调用都会直接返回缓存的模块实例。

由于 `import()` 是异步的，因此在模块加载完成之前，模块中导出的变量或函数是无法使用的。因此，在使用 `import()` 导入模块时，需要使用 Promise 或 async/await 等机制来处理异步操作。

## 总结

- `import` 和 `import()` 都是 ES6 中用于导入模块的语句，而 `require()` 则是 Node.js 中用于导入模块的函数。

- 使用 `import` 语句导入模块时，模块会被静态加载，也就是在编译时就已经确定了导入的模块；`import()` 和 `require()` 都是动态加载模块的方式，它们都允许在代码运行时根据需要加载模块，而不是在编译时就将所有模块都加载进来。`import()` 是基于 Promise 的异步加载，`require()` 是同步加载模块。

- 在整个应用程序中，使用 `import` 和 `import()` 导入的模块都是单例模式。也就是共用同一个模块实例，而使用 `require()` 导入的模块会因为赋值而产生多个实例。

- `import` 和 `import()` 语句支持模块的默认导出和命名导出，而 `require()` 只支持模块的默认导出（module.exports）。
