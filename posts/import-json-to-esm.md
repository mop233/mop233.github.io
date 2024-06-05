---
title: '在 ESM 中导入 JSON 文件'
date: '2022-2-19'
category: '前端'
tags: ['javascript', 'module']
detail: '在 Node.js 的 ES 模块中处理 JSON 文件，有两种常规解决方案和一种实验性解决方案。'
---

# 在 ESM 中导入 JSON 文件

有时候，我们需要在 Node.js 的 ES 模块中处理 JSON 文件。但是，当你试图直接在 ES 模块中导入一个 JSON 文件时，Node.js 会抛出一个错误：`TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".json"`。这是因为 Node.js 在使用 `import` 语句时，默认期望的是 JavaScript 代码。

目前有两种常规解决方案，和一种实验性解决方案。

## 常规方案

1. 使用 fs 模块读取和解析 JSON 文件

   Node.js 建议使用 fs 模块并自己完成读取文件和解析的工作。其实就是使用 fs 模块读取 JSON 文件，然后再用 `JSON.parse` 进行解析。

   ```js
   import { readFile } from 'fs/promises'
   const json = JSON.parse(
     await readFile(new URL('./some-file.json', import.meta.url))
   )
   ```

2. 利用 CommonJS 的 `require` 方法加载 JSON 文件

   `createRequire` 允许你构造 CommonJS 的 `require` 方法，以便可以使用典型的 CommonJS 功能，例如在 Node.js 中读取 JSON ES 模块。

   ```js
   import { createRequire } from 'module'
   const require = createRequire(import.meta.url)
   const data = require('./data.json')
   ```

这两种方案的区别在于：

- `require` 机制情况下，如果多个模块都加载了同一个 JSON 文件，那么其中一个模块改变了 JS 对象，其他模块中的 JS 对象会跟着改变。这是由 Node 模块的缓存机制造成的，只有一个 JS 对象。

- 第一种方式可以随意改变加载后的 JS 变量，而且各模块互不影响，因为它们都是独立的，是多个 JS 对象。

## 实验性方案

由于 JSON 模块的提议，允许使用常规的 `import` 语句在 ES 模块中导入 JSON 数据。你可以通过添加导入断言来表明你要导入的数据类型为 JSON。

```js
import jsonObject from './file.json' assert { type: 'json' }
```

`assert { type: 'json' }` 是一个导入断言，指示模块应该被解析和导入为 json。`jsonObject` 变量包含解析 `file.json` 的内容后创建的 JavaScript 对象。

一个 JSON 模块的内容是使用默认导入的，命名的导入不可用。

JSON 模块也可以动态导入：

```js
const { default: jsonObject } = await import('./file.json', {
  assert: {
    type: 'json'
  }
})
```

当一个 JSON 模块被动态导入时，包括一个 JS 对象，默认的内容在该对象的 `default` 属性中。
