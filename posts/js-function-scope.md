---
title: 'JavaScript 中的函数作用域及闭包'
date: '2024-7-11'
category: '前端'
tags: ['javascript']
detail: '闭包是 JavaScript 语言的一个难点，也是它的特色。要理解闭包，首先必须理解变量作用域。'
---

# JavaScript 中的函数作用域及闭包

作用域（scope）值得是变量存在的范围。在 ES5 的规范中，JavaScript 只有两种作用域：一种是全局作用域，变量在整个程序中一直存在，所有地方都可以读取；另一种是函数作用域，变量只在函数内部存在。ES6 又新增了块级作用域，本文不涉及。

对于顶层函数来说，函数外部声明的变量就是全局变量（global variable），它可以在函数内部读取。

```js
var v = 1

function f() {
  console.log(v)
}

f()
// 1
```

上面的代码表明，函数 `f` 内部可以读取全局变量 `v`。

在函数内部定义的变量，外部无法读取，称为“局部变量”（local variable）。

```js
function f() {
  var v = 1
}

v // ReferenceError: v is not defined
```

上面代码中，变量 `v` 在函数内部定义，所以是一个局部变量，函数之外就无法读取。

函数内部定义的变量，会在该作用域内覆盖同名全局变量。

```js
var v = 1

function f() {
  var v = 2
  console.log(v)
}

f() // 2
v // 1
```

上面代码中，变量 `v` 同时在函数的外部和内部有定义。结果，在函数内部定义，局部变量 `v` 覆盖了全局变量 `v`。

::: warning 注意
对于 `var` 命令来说，局部变量只能在函数内部声明，在其他区块中声明，一律都是全局变量。

```js
if (true) {
  var x = 5
}
console.log(x) // 5
```

上面代码中变量 `x` 在条件判断区块之中声明，结果就是一个全局变量，可以在区块之外读取。
:::

## 函数内部的变量提升

与全局作用域一样，函数作用域内部也会产生“变量提升”现象，`var` 命令声明的变量，不管在什么位置，变量声明都会被提升到函数体的头部。

```js
function foo(x) {
  if (x > 100) {
    var tmp = x - 100
  }
}

// 等同于
function foo(x) {
  var tmp
  if (x > 100) {
    tmp = x - 100
  }
}
```

## 函数本身的作用域

函数本身也是一个值，也有自己的作用域。它的作用域与变量一样，就是其声明时所在的作用域，与其运行时所在的作用域无关。

```js
var a = 1
var x = function () {
  console.log(a)
}

function f() {
  var a = 2
  x()
}

f() // 1
```

上面代码中，函数 `x` 是在函数 `f` 的外部声明的，所以它的作用域绑定外层，内部变量 `a` 不会到函数 `f` 体内取值，所以输出 1，而不是 2。

总之，函数执行时所在的作用域，是定义时的作用域，而不是调用时所在的作用域。

很容易犯错的一点是，如果函数 `A` 调用函数 `B`，却没考虑到函数 `B` 不会引用函数 `A` 的内部变量。

```js
var x = function () {
  console.log(a)
}

function y(f) {
  var a = 2
  f()
}

y(x)
// ReferenceError: a is not defined
```

上面代码将函数 `x` 作为参数，传入函数 `y`。但是，函数 `x` 是在函数 `y` 体外声明的，作用域绑定外层，因此找不到函数 `y` 的内部变量 `a`，导致报错。

同样的，函数体内部声明的函数，作用域绑定函数体内部。

```js
function foo() {
  var x = 1
  function bar() {
    console.log(x)
  }
  return bar
}

var x = 2
var f = foo()
f() // 1
```

上面代码中，函数 `foo` 内部声明了一个函数 `bar`，`bar` 的作用域绑定 `foo`。当我们在 `foo` 外部取出 `bar` 执行时，变量 `x` 指向的是 `foo` 内部的 `x`，而不是 `foo` 外部的 `x`。正式这种机制，构成了下文要讲解的“闭包”现象。

## 闭包

闭包（closure）是 JavaScript 语言的一个难点，也是它的特点，很多高级应用都要依靠闭包实现。

理解闭包，首先应该理解变量作用域。前面提到，JavaScript 有两种作用域：全局作用域和函数作用域。函数内部可以直接读取全局变量。

```js
var n = 999

function f1() {
  console.log(n)
}
f1() // 999
```

上面代码中，函数 `f1` 可以读取全局变量 `n`。

但是，正常情况下，函数外部无法读取函数内部声明的变量。

```js
function f1() {
  var n = 999
}

console.log(n)
// Uncaught ReferenceError: n is not defined(
```

上面代码中，函数 `f1` 内部声明的变量 `n`，函数外是无法读取的。

如果处于种种原因，需要得到函数内的局部变量。正常情况下，这是办不到的，只有通过变通方法才能实现。那就是在函数的内部，再定义一个函数。

```js
function f1() {
  var n = 999
  function f2() {
    console.log(n) // 999
  }
}
```

上面代码中，函数 `f2` 就在函数 `f1` 内部，这时 `f1` 内部的所有局部变量，对 `f2` 都是可见的。但是反过来就不行，`f2` 内部的局部变量，对 `f1` 就是不可见的。这就是 JavaScript 语言特有的“链式作用域”结构（chain scope），子对象会一级一级地向上寻找所有父对象的变量。所以，父对象的所有变量，对子对象是可见的，反之则不成立。

既然 `f2` 可以读取 `f1` 的局部变量，那么只要把 `f2` 作为返回值，我们不就可以在 `f1` 外部读取它的内部变量了吗！

```js
function f1() {
  var n = 999
  function f2() {
    console.log(n)
  }
  return f2
}

var result = f1()
result() // 999
```

上面代码中，函数 `f1` 的返回值就是函数 `f2`，由于 `f2` 可以读取 `f1` 的内部变量，所以就可以在外部获得 `f1` 的内部变量了。

闭包就是函数 `f2`，即能够读取其他函数内部变量的函数。由于在 JavaScript 语言中，只有函数内部的子函数才能读取内部变量，因此可以把闭包简单理解成“定义在一个函数内部的函数”。闭包最大的特点，就是它可以“记住”诞生环境，比如 `f2` 记住了它诞生的环境 `f1`，所以从 `f2` 可以得到 `f1` 的内部变量。在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

闭包的最大用处有两个，一个是可以读取外层函数内部的变量，另一个就是让这些变量始终保持在内存中，即闭包可以使得它的诞生环境一直存在。请看下面的例子，闭包使得内部变量记住上一次调用时的运行结果。

```js
function createIncrementor(start) {
  return function () {
    return start++
  }
}

var inc = createIncrementor(5)

inc() // 5
inc() // 6
inc() // 7
```

上面代码中，`start` 是函数 `createIncrementor` 的内部变量。通过闭包，`start` 的状态被保留了，每一次调用都是在上一次调用的基础上进行计算。从中可以看到，闭包 `inc` 使得函数 `createIncrementor` 的内部环境一直存在。所以，闭包可以看做是函数内部作用域的一个接口。

为什么闭包能够返回外层函数的内部变量？原因是闭包（上例的 `inc`）用到了外层变量（`start`），导致外层函数（`createIncrementor`）不能从内存释放。只要闭包没有被垃圾回收机制清除，外层函数提供的运行环境也不会被清除，它的内部变量就始终保存着当前值，供闭包读取。

闭包的另一个用处，是封装对象的私有属性和私有方法。

```js
function Person(name) {
  var _age
  function setAge(n) {
    _age = n
  }
  function getAge() {
    return _age
  }

  return {
    name: name,
    getAge: getAge,
    setAge: setAge
  }
}

var p1 = Person('张三')
p1.setAge(25)
p1.getAge() // 25
```

上面代码中，函数 `Person` 的内部变量 `_age`，通过闭包 `getAge` 和 `setAge`，变成了返回对象 `p1` 的私有变量。

::: danger 注意
外层函数每次运行，都会生成一个新的闭包，而这个闭包又会保留外层函数的内部变量，所以内存消耗很大。因此不能滥用闭包，否则会造成网页的性能问题。
:::

## 立即调用的函数表达式（IIFE）

根据 JavaScript 的语法，圆括号 `()` 跟在函数名之后，表示调用该函数。比如，`print()` 就表示调用 `print` 函数。

有时，我们需要在定义函数之后，立即调用该函数。这时，你不能在函数的定义之后加上圆括号，这会产生语法错误。

```js
function(){ /* code */ }();
// SyntaxError: Unexpected token (
```

产生这个错误的原因是，`function` 这个关键字既可以当作语句，也可以当作表达式。

```js
// 语句
function f() {}

// 表达式
var f = function f() {}
```

当作表达式时，函数可以定义后直接加圆括号调用。

```js
var f = (function f() {
  return 1
})()
f // 1
```

上面的代码中，函数定义后直接加圆括号调用，没有报错。原因就是 `function` 作为表达式，引擎就把函数定义当作一个值。这种情况下，就不会报错。

为了避免解析的歧义，JavaScript 规定，如果 `function` 关键字出现在行首，一律解析成语句。因此，引擎看到行首是 `function` 关键字之后，认为这一段都是函数的定义，不应该以圆括号结尾，所以就报错了。

函数定义后立即调用的解决方法，就是不要让 `function` 出现在行首，让引擎将其理解成一个表达式。最简单的处理，就是将其放在一个圆括号里面。

```js
;(function () {
  /* code */
})()
// 或者
;(function () {
  /* code */
})()
```

上面两种写法都是以圆括号开头，引擎就会认为后面跟的是一个表达式，而不是函数定义语句，所以就避免了错误。这就叫“立即调用的函数表达式”（Immediately-Invoked Function Expression），简称 IIFE。

::: danger 注意
上面两种写法的分号都是必须的。如果省略分号，遇到连着两个 IIFE，可能就会报错。
:::

推而广之，任何让杰斯器以表达式来处理函数定义的方法，都能产生同样的效果，比如下面三种写法：

```js
// 写法一
var i = (function () {
  return 10
})()

// 写法二
true &&
  (function () {
    /* code */
  })()

// 写法三
0,
  (function () {
    /* code */
  })()
```

甚至下面这样写，也是可以的：

```js
!(function () {})()
~(function () {})()
;-(function () {})()
;+(function () {})()
```

通常情况下，只对匿名函数使用这种“立即执行的函数表达式”。它的目的有两个：一是不必为函数命名，避免了污染全局变量；二是 IIFE 内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量。

```js
// 写法一
var tmp = newData
processData(tmp)
storeData(tmp)

// 写法二
;(function () {
  var tmp = newData
  processData(tmp)
  storeData(tmp)
})()
```

上面代码中，写法二逼写法一更好，因为完全避免了污染全局变量。
