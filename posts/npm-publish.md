---
title: '发布一个标准开源库'
date: '2024-2-7'
category: '工程化'
tags: ['npm']
detail: '当代码层面的工作完成之后，要想使我们的库成为一个标准开源库，还需要完成一些额外的工作。'
---

# 发布一个标准开源库

当代码层面的工作完成之后，你可能需要将库发布给使用者。但是要想使我们的库成为一个标准开源库，还需要完成一些额外的工作。比如，如何将库开源到 GitHub 上，如何将构建后的代码发布到 npm 上，等等。

## 选择开源协议

在开源之前，需要先选择一个开源协议，添加开源协议的主要目的是明确声明自己的权利。如果没有开源协议，则会有两种可能：一种可能是会被认为放弃所有权利，此时可能会被别有用心的人钻了空子，如恶意剽窃、抄袭等，这会损害开发者的利益；另一种可能是会被认为协议不明，一般商业项目都会很小心地选择使用的库，如果缺少协议，通常不会使用，这会让我们的库损失一部分使用者。

除此之外，如果开源库存在缺陷，并因此给库的使用者造成了损失，则可能会有法律纠纷，这对库的开发者是非常不利的，但是通过协议可以提前规避这些问题。综上所述，建议一定要添加开源协议。

开源项目常用的开源协议有 5 个，分别是 GPL、LGPL、MIT、BSD 和 Apache，前端项目目前使用最多的开源协议是 MIT、BSD 和 Apache。

::: tip 提示
BSD 协议有多种版本，这里特指 BSD 2-Clause "Simplified" License。
:::

下面简单对比一下 MIT、BSD 和 Apache 这三个开源协议之间的区别（其中空白处代表协议中未提到此项内容）：

||MIT|BSD|Apache|
|:---:|:---:|:---:|:---:|
|商业用途|✅|✅|✅|
|可以修改|✅|✅|✅|
|可以分发|✅|✅|✅|
|授权专利许可|||✅|
|私人使用|✅|✅|✅|
|商标使用|||❌|
|承担责任|❌|❌|❌|

从上面的对比可以发现，MIT 协议和 BSD 协议比较相似，而 Apache 协议的要求则更多。下表为这 3 个开源协议在 GitHub 上排名靠前的项目，可以看到，在影响力较大的项目中，使用 MIT 和 Apache 协议的项目更多一些：

|协议|项目|
|:---:|:---|
|MIT|jQuery、React、Lodash、Vue.js、Angular、ESLint|
|BSD|Yeoman、node-inspector|
|Apache|ECharts、Less.js、math.js、TypeScript|

一般的库建议选择 MIT 协议，如果涉及专利技术，则可以选择 Apache 协议。

首先，在根目录下新建一个 LICENSE 文件：

```sh
touch LICENSE
```

接下来，在 LICENSE 文件中添加如下内容：

```
MIT License

Copyright (C) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

需要注意的是，要修改当前年份 `<year>`，并将开发者名字 `<copyright holders>` 替换为自己的名字。

MIT 协议是比较宽松的协议，使用者的唯一要求就是保留协议即可，但也声明了不承担责任，是对库的开发者的保护。

## 完善文档

当使用一个库时，我们希望有清晰完整的文档。文档的格式推荐使用 Markdown 语法，因为它更容易书写和阅读。

一个标准的前端库文档应该包含如下内容：

### README.md

README 是库的使用者最先看到的内容，README 的好坏在一定程度上直接影响库的使用者的选择。README 的书写原则是主题清晰、内容简介。一个合格的 README 应该包括如下内容：

- 库的介绍——概括介绍库解决的问题
- 使用者指南——帮助使用者快速了解如何使用
- 贡献者指南——方便社区为开源库做贡献

### TODO.md

待办清单用来记录即将发布的内容或未来的计划。其主要目的有两个：一个是告诉库的使用者，当前库未来会支持的功能；另一个是让库的开发者将其作为备忘，提醒自己将来要交付的功能。

待办列表项可以使用 Markdown 语法中的 `[x]` 和 `[ ]` 来表示勾选和未勾选状态。

### CHANGELOG.md

变更日志用来记录每次更新详细的变更内容。变更日志的主要目的有两个：一个是方便库的使用者升级版本时了解升级的内容，从而避免可能带来的风险；另一个是方便库的开发者记录变更备忘。

变更日志一般会记录版本号、变更时间和具体的变更内容，变更内容要尽量做到简单明了。

### API 文档

API 文档用来提供更详细的内容，包括每个函数的参数、返回值和使用示例。根据库的功能多少，创建 API 文档时可以选择以下 3 中方案：

- 功能较少，可以直接写在 README.md 文件中
- 内容较多，可以单独写一个 API.md 文件
- API 的数量总舵，可能要考虑专门做一个网站来提供详细的文档功能

## 发布

### 发布到 GitHUb

GitHub 是最大的开源写作平台，大部分前端库都通过 GitHub 托管代码。

想要将开源库发布到 GitHub 上，首先需要注册 GitHub 账号，然后给要创建的仓库起一个名字，其他信息可以都不填写。

仓库创建好后，会跳转到仓库的详情页，新建的仓库中还没有任何内容，其中会显示将代码推送到 GitHub 的步骤。在推送代码前，需要完成最后的检查工作。有一些代码并不需要提交，此时可以通过 Git 提供的功能忽略这些文件。

在项目的根目录加添加 `.gitignore` 文件，并在该文件中添加需要忽略的文件和目录，如下：

```
node_modules
dist
coverage
.nyc_output
```

之后按照 GitHub 提示的步骤进行推送即可。刷新 GitHub 页面，如果看到推送上去的代码，就表示推送成功了。至此，就完成了开放源代码到 GitHub 上的工作。

### 发布到 npm

库的使用者通过 GitHub 可以获得开源库的很多信息，但如果想直接使用 GitHub 上的开源库，则只能通过手动下载代码的方式，而这种方式效率比较低下。npm 解决了库分发下载的各种问题，npm 是全球最大的包托管平台，提供了开源库托管、检索和下载功能。将开源库发布到 npm 上后，用户只需一个命令即可完成库的下载工作。

首先需要注册一个 [npm](https://www.npmjs.com) 账号，npm 支持将库发布到全局空间和用户空间下两种方式。推荐将库发布到自己的账号下，因为全局空间名字冲突的概率很大。

完成账号注册后，如果想要通过命令将库发布打 npm 上，首先需要在命令行中登录账号，登录成功后通过 `whoami` 命令来查看当前的登录账号：

```sh
npm login
npm whoami
```

- 配置发布文件

  在将库发布之前，需要做一些准备工作。并不是所有代码都需要发布到 npm 上，无用的代码发布到 npm 上不仅会浪费存储空间，也会影响使用者下载库的速度。从理论上来说，只需要发布 dist 目录和 LICENSE 文件即可，因为 README.md、CHANGELOG.md 和 package.json 文件是默认发布的。

  npm 提供了黑名单和白名单两种方式过滤文件，先来介绍黑名单的方式。npm 不仅会自动忽略 `.gitignore` 中的文件，还会忽略 `node_modules` 目录和 `package-lock.json` 文件。如果还需要忽略其他文件，则可以在根目录下添加一个 `.npmignore` 文件，该文件的格式和 `.gitignore` 文件的格式是一样的，内容示例如下：

  ```
  # .npmignore

  config
  doc
  src
  test
  ```

  对于黑名单的方式，在新增不需要发布的文件时，容易因为忘记修改 `.npmignore` 文件而导致误上传一些无用文件，因此推荐使用白名单的方式。如果在 package.json 文件中添加 `files` 字段，则只有在 `files` 中的文件才会被发布，示例代码如下：

  ```json
  {
    "files": ["/dist", "LICENSE"]
  }
  ```

  ::: danger 注意
  如果两种方式同时存在，npm 会忽略黑名单的配置。
  :::

  配置好要发布的文件后，运行 `npm pack --dry-run` 命令可以验证哪些文件会被发布。

- 管理不同版本

  每次开源库有更新都会向 npm 发布新的包，npm 通过版本号来管理一个库的不同版本。发布到 npm 上的包需要遵循语义化版本，其格式为 `主版本号.次版本号.修订号-先行版本号`，可以简写为 `x.y.z-prerelease`，每一位的含义如下：

  - x 代表不兼容的改动
  - y 代表新增了功能，向下兼容（当 x 为 0 时，y 的变更也可以不向下兼容）
  - z 代表修复 bug，向下兼容
  - prerelease 是可选的，可以是被 `.` 分隔的任意字符

  prerelease 一般用来发布测试版本，在程序尚未稳定时，可以先发布测试版本，稳定后再发布正式版本。下面是一组测试版本和正式版本号的示例：

  ```
  # 测试版本号
  1.0.0-alpha.1
  1.0.0-beta.1

  # 正式版本号
  1.0.0
  1.0.1
  ```

  在发布新版本之前，需要修改版本号，同时要同步更新 CHANGELOG.md 文件，添加变更记录，然后直接运行 `publish` 命令即可。

  正式包的发布很简单，而测试包则需要借助 npm 提供的标签功能，如果不添加标签，则默认会发布到 latest 标签。下面是发布测试包和正式包的示例：

  ```sh
  # 发布测试包
  npm publish --tab=beta

  # 发布正式包
  npm publish
  ```

  如果是位于 scope 下的包，如位于 `mopsite` 用户名下的包 `@mopsite/my-package`，那么直接使用 `npm publish` 命令发布会报错。这是因为 npm 命令在发布 scope 下的包时，会默认将其发布为私有包，然而只有付费用户才可以发布私有包。此时只需要给 npm 命令添加参数 `--access public`，将包发布为公开包即可。示例如下：

  ```sh
  npm pulish --access public
  ```

  如果不想每次发布包时都添加参数，则可以修改 package.json 文件，在该文件中添加 `publishConfig` 字段就可以了。代码如下：

  ```json
  {
    "publishConfig": {
      "registry": "https://registry.npmjs.org",
      "access": "public"
    }
  }
  ```

  在包发布成功后，还需要添加 Git tag。如果没有 Git tag，那么当想要找到历史上某个版本对应的源代码时，就需要翻找 Git 历史才能找到，既麻烦又容易出错。一个比较常见的场景就是当给历史版本修复 bug 时，Git tag 会变得非常有用。使用 Git 添加 tag 的命令如下：

  ```sh
  git tag 1.0.0 # 添加指定版本的 tag

  git push --tags # 将 tag 推送到远端
  ```

  npm 提供的 `version` 命令也可以修改版本号。和手动修改版本号相比，npm 除了可以修改 package.json 中 `version` 字段的版本号，还可以自动添加 Git tag。npm 提供了 4 个子命令，分别用来修改版本号的 4 个位置。使用示例如下：

  ```sh
  # 初始版本号是 1.0.0

  npm version prerelease --preid=beta
  # 1.0.0-beta.0

  npm version prerelease --preid=beta
  # 1.0.0-beta.1

  npm version patch
  # 1.0.1

  npm version minor
  # 1.1.0

  npm version major
  # 2.0.0
  ```

  在包发布完成后，可以使用 npm 命令安装测试。需要注意的是，对于测试版本的包，需要显示指定版本号才可以安装成功：

  ```sh
  npm @mopsite/my-package
  npm @mopsite/my-package@1.0.0-beta.1
  ```

## 统计数据

经历前面的步骤，终于发布了我们的库。发布后可以关注库的使用情况，及时了解库的使用数据，以及库的受欢迎程度。

### GitHub 数据

GitHub 提供的最直接的数据就是 Star 数了，如果用户对开源库感兴趣，或者觉得日后可能会用到，就会直接“star”，star 行为在社区里被翻译为“加星”。除了 Star 数，还有 Watch 数和 Fork 数。Watch 数反应了对库开发感兴趣的人及有潜力成为贡献者的人的数量；Fork 数反应了自己的代码被其他人克隆的次数，Fork 数背后的很大一部分人都是对源代码感兴趣的，可能是学习原理的，也可能是要贡献代码的。

在 GitHub 上看能查看我们的仓库被哪些其他仓库依赖了。如果某个仓库的 package.json 文件的 `dependencies` 字段中包含了我们仓库的名字，则表示我们的仓库被该仓库依赖了。查看“Insights”面板下的“Dependency graph”子面板，可以看到有哪些仓库依赖了我们的仓库。

### npm 数据

在 npm 上可以查看某个包最近 40 周的周下载量，这些数据会被显示为一个折线图，在折线图上移动鼠标指针，可以查看任意一周的下载量数据。

下载量可以反应库的实际使用情况。除了下载量，npm 还提供了依赖关系数据，其位于详情页的“Dependencies”和“Dependents”面板中。前者显示我们的库依赖的库，后者显示依赖我们库的库。

### 自定义数据

npm 命令行为每个执行的命令都提供了 pre 和 post 钩子，分别代表命令执行之前和执行之后。例如，在执行 `npm install` 命令时，npm 实际上会执行下面 3 条命令：

```sh
npm run preinstall
npm install
npm run postinstall
```

通过 npm 提供的 preinstall 钩子，即可实现自定义统计数据。首先修改 package.json 文件，注册 postinstall 钩子。示例代码如下：

```json
{
  "scripts": {
    "postinstall": "node postinstall.js"
  }
}
```

当使用者安装我们的库时，会自动使用 Node.js 执行 postinstall.js 文件中的内容。

::: warning 提示
如果使用者在安装我们的库时使用了参数 `--ignore-scripts`，则跳过执行 postinstall 钩子。二者的区别示例如下：

```sh
npm install xxx # 执行 postinstall.js 文件

npm install --ignore-scripts xxx # 不执行 postinstall.js 文件
```
:::

在项目的根目录下添加 postinstall.js 文件，该文件中的内容如下：

```js
// postinstall.js

const axios = require('axios').default;

axios.get('/tongji/install_count').then(function (response) {
  // 请求成功，打印一个日志
  console.log(response);
});
```

::: danger 注意
对于一般公司内部的项目，可以通过上述方式来收集更详细的信息，如仓库地址等。而对于公开的项目，则应该谨慎使用上述方式来统计数据，使用 postinstall 钩子来统计数据在开源库中比较少见，postinstall 钩子常见的用法是安装完后做一些初始化工作。
:::
