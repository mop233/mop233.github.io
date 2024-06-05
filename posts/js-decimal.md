---
title: 'JS 中小数计算不精准的原因和解决方案'
date: '2023-10-31'
category: '前端'
tags: ['javascript']
detail: '计算机的计算跟我们熟知的数学计算原理一样，只是计算机内部在存储数据时，和我们想象的不同。'
---

# JS 中小数计算不精准的原因和解决方案

## 现象

在编程语言中，有一种很奇怪的现象：当小数和小数发生运算的时候，结果跟我们熟识的数学运算结果不同。如下：

```js
var num1 = 0.1
var num2 = 0.2
var num3 = num1 + num2
console.log(num3) // 0.30000000000000004
```

我们在已有的数学知识基础上，以为结果应该是精准的 0.3，可结果并不是。这种现象在所有编程语言中都有，JavaScript 也不例外。

## 原因

计算机的计算跟我们熟知的数学计算原理一样，只是计算机内部在存储数据时，和我们想象的不同。

计算机因为是电子元件设备，所以内部的电子元件只有 2 种状态：通电和断电。这也就造成了计算机内部存储数据都是以二进制形式来存储的，用 1 来描述通电，用 0 来描述断电。

我们平常所进行的整数计算：

```js
var num1 = 1
var num2 = 2
var num3 = a + b
console.log(num3) // 3
```

这个结果 3，不是单纯的 1 加上 2。在计算机内部会将 1 以二进制的形式存储起来，将 2 也以二进制形式存储起来，然后在计算机内部，将两个二进制数字相加，得到一个二进制的相加结果，最后将这个二进制结果转为十进制输出。

同理，小数在计算的时候也是一样的。可是小数转成二进制的时候，因为要对数据乘 2 直到取整，所以像 0.5 这种数字，可以很快计算得到二进制结果。

但是 0.1 和 0.2 这样的数字，是永远不可能计算得到精准的二进制结果的，因为一直乘 2，就没有得到整数的时候，因此，在转换二进制的过程中，会形成无限死循环。

了解上面的原因后，再看如下奇怪的计算结果：

```js
var num1 = 0.1
var num2 = 0.1
var num3 = num1 + num2
console.log(num3) // 0.2
```

根据上面的原理，我们断定只要是 0.1 参与的小数运算，一定是不准确的，可是这又怎么解释呢？

事实上，我们理解的没有错，只要是 0.1，在计算机内部存储，一定是被舍去后面的死循环的那部分，即不准确的。但两个不精确的二进制数字，在相加后，得到的二进制数字，再转换为十进制之后，正好就能转换成一个精准的十进制数字了。很神奇吧。

具体转换计算过程如下：

```
十进制：0.1
转换二进制后：0.0001 1001 1001 1001 ... 无限死循环部分
```

计算机内部对于二进制小数，根据 IEEE754 标准（一个仔细指定的表示浮点数及其运算的标准），小数部分最多会保留 52 位：

```
0.0001 1001 1001 1001 1001 1001 1001 1001 1001 1001 1001 1001 1001
+
0.0001 1001 1001 1001 1001 1001 1001 1001 1001 1001 1001 1001 1001
=
0.0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011
```

相加以后的结果，正好就对应 0.2 在计算机内部二进制被舍去后的部分，转换为十进制后正好就是 0.2。

所以，不精准是正确的，只是偶尔会有两个不精准的数字相加，正好得到一个精准的值。

## 解决

### 方法一：转整计算

将需要运算的小数扩大 10 倍、100 倍……将小数扩大到整数，然后进行运算，最后再缩小扩大的倍数。

```js
var num1 = 0.1
var num2 = 0.2
var num3 = (num1 * 10 + num2 * 10) / 10
console.log(num3) // 0.3
```

### 方法二：toFixed()

通过 JS 中 Number 的内置方法 `toFixed()`，强制保留小数点后的位数。

```js
var num1 = 0.1
var num2 = 0.2
var num3 = num1 + num2
console.log(num3.toFixed(3)) // 0.300 - 强制保留小数点后3位
```

## 封装

这里封装了一些数学方法，当需要进行数学运算时，调用这些封装好的方法即可。

第一种封装方式：

::: code-group
```js [加法]
function add(...args) {
  let num = 0
  try {
    args.forEach(item => {
      if (typeof item !== 'number') throw '数学运算要使用数字'
    })

    const arr = args.map(item => {
      const str = item.toString()
      const index = str.indexOf('.')
      const len = str.length
      return index !== -1 ? len - (index + 1) : index
      // len - (index + 1) 为小数部分的长度
    })

    const max = Math.max(...arr)
    if (max > 0) {
      // 有小数的运算
      const mi = 10 ** max
      const data = args.map(item => item * mi)
      num = data.reduce((pre, cur) => cur + pre) / mi
    } else {
      // 没有小数的运算
      num = args.reduce((pre, cur) => cur + pre)
    }
  } catch (error) {
    console.warn(error)
  }

  return num
}
```

```js [乘法]
function mul(...args) {
  let num = 0
  try {
    args.forEach(item => {
      if (typeof item !== 'number') throw '数学运算要使用数字'
    })

    const arr = args.map(item => {
      const str = item.toString()
      const index = str.indexOf('.')
      const len = str.length
      return index !== -1 ? len - (index + 1) : index
      // len - (index + 1) 为小数部分的长度
    })

    const max = Math.max(...arr)
    if (max > 0) {
      // 有小数的运算
      const mi = 10 ** max
      const data = args.map(item => item * mi)
      // 与加法唯一的区别
      num = data.reduce((pre, cur) => cur * pre) / mi ** args.length
    } else {
      // 没有小数的运算
      num = args.reduce((pre, cur) => cur * pre)
    }
  } catch (error) {
    console.warn(error)
  }

  return num
}
```
:::

第二种封装方式（推荐）：

::: code-group
```js [加法]
const add = (arg1, arg2) => {
  let r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
```

```js [减法]
const sub = (arg1, arg2) => {
  let r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}
```

```js [乘法]
const mul = (arg1, arg2) => {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try { m += s1.split('.')[1].length} catch (e) { }
  try { m += s2.split('.')[1].length} catch (e) { }
  return Number(s1.replace('.', '')) * Number(s1.replace('.', '')) / Math.pow(10, m)
}
```

```js [除法]
const div = (arg1, arg2) => {
  let t1 = 0
  let t2 = 0
  let r1, r2
  try { t1 = arg1.toString().split('.')[1].length } catch (e) { }
  try { t2 = arg2.toString().split('.')[1].length } catch (e) { }
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  let intDiv = r1 / r2
  let pow = Math.pow(10, t2 - t1)
  return mul(intDiv, pow)  // 这里用定义好的 mul 乘法方法
}
```
:::
