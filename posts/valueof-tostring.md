---
title: 'valueOf 和 toString 方法'
date: '2024-3-15'
category: '前端'
tags: ['javascript']
detail: 'valueOf 和 toString 是定义在 Object.prototype 上的，所有 Object 的实例对象都继承了它们。'
---

# valueOf 和 toString 方法

`valueOf` 和 `toString` 方法是定义在 `Object.prototype` 对象上的，称为实例方法，所有 `Object` 的实例对象都继承了它们。

## valueOf()

`valueOf` 方法的作用是返回一个对象的“值”，默认情况下返回对象本身。

```js
var obj = new Object()
obj.valueOf() === obj // true
```

`valueOf` 方法的主要用途是，JavaScript [自动类型转换](./js-covert#自动转换)时会默认调用该方法。

```js
var obj = new Object()
1 + obj // "1[object Object]"
```

上面代码将对象 `obj` 与数字 `1` 相加，这时 JavaScript 就会默认调用 `valueOf()` 方法，求出 `obj` 的值再与 `1` 相加。所以，如果自定义 `valueOf` 方法，就可以得到想要的结果。

```js
var obj = new Object()
obj.valueOf = function() {
  return 2
}
1 + obj // 3
```

上面代码自定义了 `obj` 对象的 `valueOf` 方法，于是 `1 + obj` 就得到了 `3`。这种方法就相当于用自定义的 `obj.valueOf` 覆盖了 `Object.prototype.valueOf`。

## toString()

`toString` 方法的作用是返回一个对象的字符串形式，默认情况下返回类型字符串。

```js
var o1 = new Object()
o1.toString() // "[object Object]"

var o2 = {a: 1}
o2.toString() // "[object Object]"
```

上面代码表示，对于一个对象调用 `toString` 方法，会返回字符串 `[object Object]`，该字符串说明对象的类型。

字符串 `[object Object]` 本身没有太大的用处，但是通过自定义 `toString` 方法，可以让对象在自动类型转换时，得到想要的字符串形式。

```js
var obj = new Object()

obj.toString = function() {
  return 'hello'
}

obj + ' ' + 'world' // "hello world"
```

上面代码表示，当对象用于字符串加法时，会自动调用 `toString` 方法。由于自定义了 `toString` 方法，所以返回字符串 `hello world`。

数组、字符串、函数、Date 对象都分别部署了自定义的 `toString` 方法，覆盖了 `Object.prototype.toString` 方法。

```js
[1, 2, 3].toString() // "1,2,3"

'123'.toString() // "123"

(function() {
  return 123
}).toString()
// "function() {
//   return 123
// }"

(new Date()).toString()
// "Tue May 10 2023 09:11:31 GMT+0800 (CST)"
```

## toString 的应用

`Object.prototype.toString` 方法返回对象的类型字符串，因此可以用来判断一个值的类型：

```js
var obj = {}
obj.toString() // "[object Object]"
```

上面代码调用空对象的 `toString` 方法，结果返回一个字符串 `[object Object]`，其中第二个 `Object` 表示该值的构造函数。这是一个十分有用的判断数据类型的方法。

由于实例对象可能会自定义 `toString` 方法，所以为了得到类型字符串，最好直接使用 `Ojbect.prototype.toString` 方法。通过函数的 `call` 方法，可以在任意值上调用这个方法，帮助我们判断这个值的类型：

```js
Object.prototype.toString.call(value)
```

不同数据类型的 `Object.prototype.toString` 方法返回值如下：

- 数值：`[object Number]`
- 字符串：`[object String]`
- 布尔值：`[object Boolean]`
- undefined：`[object Undefined]`
- null：`[object Null]`
- 数组：`[object Array]`
- 函数：`[object Function]`
- Date 对象：`[object Date]`
- Math 对象：`[object Math]`
- RegExp 对象：`[object RegExp]`
- Error 对象：`[object Error]`
- arguments 对象：`[object Arguments]`
- 其他对象：`[object Object]`

这就是说，`Object.prototype.toString` 可以看出一个值到底是什么类型：

```js
Object.prototype.toString.call(2) // "[object Number]"
Object.prototype.toString.call('') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(Math) // "[object Math]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call([]) // "[object Array]"
```

利用这个特性，可以写出一个比 `typeof` 运算符更准确的类型判断函数：

```js
var type = function(o) {
  var s = Object.prototype.toString.call(o)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

type({}) // "object"
type([]) // "array"
type(5) // "number"
type(null) // "null"
type() // "undefined"
type(/abcd/) // "regex"
type(new Date()) // "date"
```

在上面这个 `type` 函数的基础上，还可以加上专门判断某种类型数据的方法：

```js
var type = function(o) {
  var s = Object.prototype.toString.call(o)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp'
].forEach(function(t) {
  type['is' + t] = function(o) {
    return type(o) === t.toLowerCase()
  }
})

type.isObject({}) // true
type.isNumber(NaN) // true
type.isRegExp(/abc/) // true
```
