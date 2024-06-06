---
title: '使用 Rollup 打包 JS 模块'
date: '2024-2-5'
category: '工程化'
tags: [javascript]
detail: 'Rollup 是一个用于 JavaScript 的模块打包工具，它将小的代码片段编译成更大、更复杂的代码。'
---

# 使用 Rollup 打包 JS 模块

[Rollup](https://cn.rollupjs.org) 是一个用于 JavaScript 的模块打包工具，它将小的代码片段编译成更大、更复杂的代码，例如库或应用程序。它使用 JavaScript 的 ES6 版本中包含的新标准化代码模块格式，而不是以前的 CommonJS 和 AMD 等特殊解决方案。ES 模块允许你自由无缝地组合你最喜欢的库中最有用的个别函数。这在未来将在所有场景原生支持，但 Rollup 让你今天就可以开始这样做。

::: details 为什么 ES 模块比 CommonJS 模块更好？
ES 模块是官方标准，是 JavaScript 代码结构的明确未来发展方向，而 CommonJS 模块是一种特殊的兼容型格式，被视为 ES 模块提出之前的一种临时解决方案。ES 模块允许静态分析，可帮助进行优化（如除屑优化和作用域提升），并提供高级功能（如循环引用和实时绑定）。
:::

## 开始你的第一次打包

目前使用 Rollup 最简单的方法是通过命令行界面（CLI）操作。现在，我们将全局安装它（稍后我们将学习如何将它安装到你的项目中，以便你的构建过程具有可移植性，但暂时不用担心这个）。在命令行中输入以下内容：

```sh
npm install rollup --global
# or `npm i rollup -g` for short
```

你现在可以运行 `rollup` 命令了：

```sh
rollup
```

因为没有传入参数，Rollup 会打印出使用说明。这和运行 `rollup --help`，或者 `rollup -h` 相同。

让我们创建一个简单的项目：

```sh
mkdir -p my-rollup-project/src
cd my-rollup-project
```

首先，我们需要一个入口。将这段代码复制到一个名为 `src/main.js` 的新文件中：

```js
// src/main.js
import foo from './foo.js';
export default function () {
	console.log(foo);
}
```

接下来，让我们创建一个名为 `foo.js` 的模块，它在入口文件中被导入：

```js
// src/foo.js
export default 'hello world!';
```

现在我们已经准备好进行一次打包：

```sh
rollup src/main.js -f cjs
```

`-f` 选项（是 `--format` 的缩写）指定了产物的类型——在本例中是 CommonJS（可以在 Node.js 中运行）。因为我们没有指定输出文件，所以它将直接打印到 `stdout`：

```js
'use strict';

const foo = 'hello world!';

const main = function () {
	console.log(foo);
};

module.exports = main;
```

你也可以像这样将产物保存为文件：

```sh
rollup src/main.js -o bundle.js -f cjs
```

尝试运行这段代码：

```
node
> var myBundle = require('./bundle.js');
> myBundle();
'hello world!'
```

恭喜！你已经使用 Rollup 完成了一次打包！

## 使用配置文件

到目前为止，一切都很好，但随着我们添加更多选项，输入命令会变得有点麻烦。

为了避免重复输入，我们可以创建一个包含所有必要选项的配置文件。配置文件是用 JavaScript 编写的，比原始的 CLI 更加灵活。

在项目根目录中创建一个名为 `rollup.config.mjs` 的文件，并添加以下代码：

```js
// rollup.config.mjs
export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	}
};
```

::: warning 提示
你也可以使用 CJS 模块，例如 `module.exports = {/* config */}`。
:::

要让配置文件生效，我们需要使用 `--config` 或 `-c`：

```sh
rm bundle.js # 删除它我们可以检查命令是否正常！
rollup -c
```

你可以使用等效的命令行选项覆盖配置文件中的任何选项：

```sh
rollup -c -o bundle-2.js # `-o` 等价于 `--file`（曾用名为 "output"）
```

::: warning 注意
Rollup 本身会处理配置文件，这就是为什么我们可以使用 `export default` 语法的原因——代码没有被 Babel 或任何类似的工具转换，因此你只能使用在你当前使用的 Node 版本中支持的 ES2015 功能。
:::

如果你想，你也可以选择指定不同于默认的 `rollup.config.mjs` 的配置文件：

```sh
rollup --config rollup.config.dev.mjs
rollup --config rollup.config.prod.mjs
```

### 智能提示

由于 Rollup 随附了 TypeScript 类型定义，因此你可以使用 JSDoc 类型提示来利用你的 IDE 的智能感知功能：

```js
// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  /* 你的配置 */
}
export default config
```

或者，你可以使用 `defineConfig` 辅助函数，它提供了无需 JSDoc 注释即可使用智能感知的功能：

```js
// rollup.config.js
import { defineConfig } from 'rollup'

export default defineConfig({
  /* 你的配置 */
})
```

## 本地安装 Rollup

在团队或分布式环境中工作时，将 Rollup 添加为本地依赖可能是明智的选择。本地安装 Rollup 可以避免多个贡献者单独安装 Rollup 的额外步骤，并确保所有贡献者使用相同版本的 Rollup。

用 NPM 安装 Rollup 到本地：

```sh
npm install rollup --save-dev
```

或者使用 Yarn：

```sh
yarn -D add rollup
```

安装完成后，通常会在 package.json 中添加一个单一的构建脚本，为所有贡献者提供方便的命令。例如：

```json
{
	"scripts": {
		"build": "rollup --config"
	}
}
```

::: warning 提示
一旦本地安装完成，当运行脚本命令时，不管是 NPM 还是 Yarn 都可以找到 Rollup 的可执行文件并执行。
:::

## 使用插件

到目前为止，我们已经用入口文件和通过相对路径导入的模块打了一个简单的包。随着你需要打包更复杂的代码，通常需要更灵活的配置，例如导入使用 NPM 安装的模块、使用 Babel 编译代码、处理 JSON 文件等。

为此，我们使用插件，在捆绑过程的关键点更改 Rollup 的行为。一个很棒的插件列表保存在 [the Rollup Awesome List](https://github.com/rollup/awesome)。

在本教程中，我们将使用 [@rollup/plugin-json](https://github.com/rollup/plugins/tree/master/packages/json)，它允许 Rollup 从 JSON 文件中导入数据。

在项目根目录中创建一个名为 `package.json` 的文件，并添加以下内容：

```json
{
	"name": "rollup-tutorial",
	"version": "1.0.0",
	"scripts": {
		"build": "rollup -c"
	}
}
```

将 @rollup/plugin-json 安装到开发依赖中：

```sh
npm install --save-dev @rollup/plugin-json
```

这是使用 `--save-dev` 而不是 `--save`，因为我们的代码在运行时实际上不依赖于插件，只有在打包时才需要。

更新你的 `src/main.js` 文件，使其从 `package.json` 导入而不是 `src/foo.js`：

```js
// src/main.js
import { version } from '../package.json';

export default function () {
	console.log('version ' + version);
}
```

在 `rollup.config.mjs` 文件中假如 JSON plugin：

```js
// rollup.config.mjs
import json from '@rollup/plugin-json';

export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
	plugins: [json()]
};
```

使用 `npm run build` 运行 Rollup。结果应该如下所示：

```js
'use strict';

var version = '1.0.0';

function main() {
	console.log('version ' + version);
}

module.exports = main;
```

结果中只导入了我们实际需要的数据 `version`，`package.json` 中的其他内容都被忽略了。这就是除屑优化的作用。

::: details 什么是除屑优化？
除屑优化（Tree-Shaking），即“保留有用代码”，是 Rollup 的一个处理过程，用于消除在给定项目中实际上未使用的代码。它是一种冗余代码消除的形式，但与输出大小相关的地方相比，可以更加高效。该名称源自模块的抽象语法树（而不是模块图）。该算法首先标记所有相关语句，然后“摇晃语法树（让枯枝掉下来）”，删除所有冗余代码。它的思想与“标记-清除垃圾收集算法”类似。尽管此算法与 ES 模块本身不相关，但这个思想使其更加高效，因为它们允许 Rollup 将所有模块作为一个具有共享绑定的大型抽象语法树进行处理。
:::

Rollup 力求实现 ES 模块的规范，而不是 Node.js、NPM、`require()` 和 CommonJS 的行为。因此，CommonJS 模块的加载和使用 Node 的模块位置解析逻辑都作为可选插件实现，不包含在 Rollup 核心中。只需 `npm install` [commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) 和 [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 插件，然后使用 `rollup.config.js` 文件启用它们，即可完成设置。详情参见[与其他 NPM 包](#与其他-npm-包)。

### 使用输出插件

某些插件也可以专门应用于某些输出，这些插件只能在 Rollup 的主要分析完成后修改代码。如果使用不兼容的插件作为特定输出插件，Rollup 将会发出警告。一个可能的用例是压缩产物以在浏览器中使用。

让我们扩展上一个示例，提供一个最小化的构建和一个非最小化的构建。为此，我们需要安装 `@rollup/plugin-terser`：

```sh
npm install --save-dev @rollup/plugin-terser
```

编辑你的 `rollup.config.mjs` 文件，添加另一个最小化压缩的输出。我们选择 `iife` 作为格式。该格式会将代码封装起来，以便可以通过浏览器中的 `script` 标签使用，同时避免与其他代码产生不必要的交互。由于设置了一个导出，因此我们需要提供一个全局变量的名称，该变量将由我们的产物构建，以便其他代码可以通过此变量访问我们的导出。

```js
// rollup.config.mjs
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
	input: 'src/main.js',
	output: [
		{
			file: 'bundle.js',
			format: 'cjs'
		},
		{
			file: 'bundle.min.js',
			format: 'iife',
			name: 'version',
			plugins: [terser()]
		}
	],
	plugins: [json()]
};
```

除了 `bundle.js`，Rollup 现在还将创建第二个文件 `bundle.min.js`：

```js
var version = (function () {
	'use strict';
	var n = '1.0.0';
	return function () {
		console.log('version ' + n);
	};
})();
```

### 与其他 NPM 包

在某个时候，你的项目可能会依赖于从 NPM 安装到 `node_modules` 文件夹中的软件包。与 webpack 和 browserify 等其他打包程序不同，Rollup 默认情况下不知道如何处理这些依赖项，我们需要添加一些配置。

我们添加一个名为 [the-answer](https://www.npmjs.com/package/the-answer) 的简单依赖，它导出了生命、宇宙和一切问题的答案：

```sh
npm install the-answer
```

如果我们更新了 `src/main.js` 文件：

```js
// src/main.js
import answer from 'the-answer';

export default function () {
	console.log('the answer is ' + answer);
}
```

然后运行 Rollup：

```sh
npm run build
```

我们会看到这样的警告：

```
(!) Unresolved dependencies
https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
the-answer (imported by main.js)
```

生成的 `bundle.js` 仍然可以在 Node.js 中使用，因为 `import` 声明会被转换为 CommonJS 的 `require` 语句，但是 `the-answer` 不会被包含在 bundle 中。为此，我们需要一个插件。

#### node-resolve

[node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 插件可以让 Rollup 找到外部模块。让我们安装它：

```sh
npm install --save-dev @rollup/plugin-node-resolve
```

然后将它添加到我们的配置文件中：

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
	plugins: [resolve()]
};
```

这一次，当你运行 `npm run build` 时，不会发出警告，bundle 包含了导入的模块。

#### commonjs

一些库会暴露出 ES 模块，你可以直接导入它们，`the-answer` 就是这样的一个模块。但是目前，大多数 NPM 上的包都以 CommonJS 模块的方式暴露。在这种情况下，我们需要在 Rollup 处理它们之前将 CommonJS 转换为 ES2015。

[commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) 插件就是用来做这件事的。

请注意，大多数情况下 commonjs 插件应该放在转换模块的其他插件之前——这是为了防止其他插件对 CommonJS 检测产生影响。一个例外是 [babel](https://github.com/rollup/plugins/tree/master/packages/babel) 插件，如果你使用它，请将它放在 commonjs 插件之前。

## 代码分割

代码分割是指有些情况下 Rollup 会自动将代码拆分成块，例如动态加载或多个入口点，还有一种方法可以显式地告诉 Rollup 将哪些模块拆分成单独的块，这是通过 `output.manualChunks` 选项实现的。

要使用代码分割功能实现惰性动态加载（其中某些导入的模块仅在执行函数后加载），我们返回到原始示例，并修改 `src/main.js`，以动态加载 `src/foo.js` 而不是静态加载：

```js
// src/main.js
export default function () {
	import('./foo.js').then(({ default: foo }) => console.log(foo));
}
```

Rollup 将使用动态导入创建一个仅在需要加载的单独块。为了让 Rollup 知道在哪里放置第二个块，我们不使用 `--file` 选项，而是使用 `--dir` 选项设置一个输出文件夹：

```sh
rollup src/main.js -f cjs -d dist
```

这将创建一个名为 `dist` 的文件夹，其中包含两个文件，`main.js` 和 `chunk-[hash].js`，其中 `[hash]` 是基于内容的哈希字符串。你可以通过指定 `output.chunkFileNames` 和 `output.entryFileNames` 选项来提供自己的命名模式。

你仍然可以像以前一样运行你的代码，并且具有相同的输出，尽管会慢一些，因为加载和解析 `./foo.js` 仅在我们第一次调用导出的函数时才开始。

```sh
node -e "require('./dist/main.js')()"
```

如果我们不使用 `--dir` 选项，Rollup 将再次将块打印到 `stdout`，并添加注释以突出显示块的边界：

```js
//→ main.js:
'use strict';

function main() {
	Promise.resolve(require('./chunk-b8774ea3.js')).then(({ default: foo }) =>
		console.log(foo)
	);
}

module.exports = main;

//→ chunk-b8774ea3.js:
('use strict');

var foo = 'hello world!';

exports.default = foo;
```

如果你想要在使用耗时很长的功能之前仅加载和解析它们一次，则此方法非常有用。

代码分割的另一个用途是能够指定共享一些依赖项的多个入口点。我们再次扩展我们的示例，添加一个名为 `src/main2.js` 的第二个入口点，它静态导入 `src/foo.js`，就像我们在原始示例中所做的那样：

```js
// src/main2.js
import foo from './foo.js';
export default function () {
	console.log(foo);
}
```

如果我们给 Rollup 提供了两个入口，那么会创建三个块：

```sh
rollup src/main.js src/main2.js -f cjs
```

输出为：

```js
//→ main.js:
'use strict';

function main() {
	Promise.resolve(require('./chunk-b8774ea3.js')).then(({ default: foo }) =>
		console.log(foo)
	);
}

module.exports = main;

//→ main2.js:
('use strict');

var foo_js = require('./chunk-b8774ea3.js');

function main2() {
	console.log(foo_js.default);
}

module.exports = main2;

//→ chunk-b8774ea3.js:
('use strict');

var foo = 'hello world!';

exports.default = foo;
```

请注意两个入口点都导入了相同的共享块。Rollup 永远不会复制代码，而是创建额外的块，仅加载必要的最少量。同样，通过传递 `--dir` 选项，将文件写入磁盘。

你可以通过原生的 ES 模块、AMD 加载器或 SystemJS，为浏览器构建相同的代码。

例如，使用 `--f es` 选项进行原生模块构建：

```sh
rollup src/main.js src/main2.js -f es -d dist
```

```html
<!doctype html>
<script type="module">
	import main2 from './dist/main2.js';
	main2();
</script>
```

或者，使用 `-f system` 选项进行 SystemJS 构建：

```sh
rollup src/main.js src/main2.js -f system -d dist
```

通过以下方式安装 SystemJS：

```sh
npm install --save-dev systemjs
```

然后根据需要在 HTML 页面中加载一个或两个入口点：

```html
<!doctype html>
<script src="node_modules/systemjs/dist/s.min.js"></script>
<script>
	System.import('./dist/main2.js').then(({ default: main }) => main());
</script>
```

请参考 [rollup-starter-code-splitting](https://github.com/rollup/rollup-starter-code-splitting) 示例，了解如何在支持原生 ES 模块的浏览器上设置使用它们的 Web 应用程序，并在必要时回退到 SystemJS。
