---
title: 'YAML 语言'
date: '2021-11-2'
category: '工程化'
tags: ['yaml']
detail: 'YAML 是专门用来写配置文件的语言，非常简洁和强大，远比 JSON 格式方便。'
---

# YAML 语言

编程免不了要写配置文件，怎么写配置文件也是一门学问。YAML 是专门用来写配置文件的语言，非常简洁和强大，远比 JSON 格式方便。

YAML 是“YAML Ain't a Markup Language”（YAML 不是一种标记语言）的递归缩写。在开发这种语言时，YAML 的意思其实是“Yet Another Markup Language”（仍是一种标记语言）。

YAML 的语法和其他高级语言类似，并且可以简单表达清单、散列表、数量等数据形式。它使用空白符号缩进和大量依赖外观的特色，特别适合用来表达或编辑数据结构、各种配置文件、文件大纲等。

YAML 的配置文件后缀名为 `.yml`，如：`runoob.yml`。

## 基本语法

YAML 语言（发音 `/ˈjæməl/`）的设计目的，就是方便人类读写。它实质上是一种通用的数据串行化格式。

它的基本语法规则如下：

- 大小写敏感
- 使用缩进表示层级关系
- 缩进不允许使用 Tab 键，只允许使用空格
- 缩进的空格数不重要，只要相同层级的元素左对齐即可

另外需要注意的是，`#` 表示注释，从这个字符一直到行尾，都会被解析器忽略。

## 数据类型

YAML 支持的数据类型有三种：

- 对象：键值对集合，又称为映射（mapping）/ 哈希（hashes）/ 字典（dictionary）
- 数组：一组按次序排列的值，又称为序列（sequence）/ 列表（list）
- 纯量：单个的、不可再分的值

::: tip 提示
本文介绍的 YAML 语法以 [JS-YAML](https://github.com/nodeca/js-yaml) 的实现为例，也可以去[在线 Demo](https://nodeca.github.io/js-yaml/) 验证下面的例子。
:::

### 对象

对象键值对使用冒号结构表示 `key: value`，**冒号后面要加一个空格**。

::: code-group
```yaml
animal: pets
```

```js
{ animal: 'pets' }
```
:::

还可以使用缩进表示层级关系：

::: code-group
```yaml
hash:
  name: Steve
  foo: bar
```

```js
{
  hash: { name: 'Steve', foo: 'bar' }
}
```
:::

YAML 也允许另一种写法，将所有键值对写成一个行内对象：

::: code-group
```yaml
hash: { name: Steve, foo: bar }
```

```js
{ hash: { name: 'Steve', foo: 'bar' } }
```
:::

### 数组

以连线词 `-` 开头的行表示构成一个数组：

::: code-group
```yaml
- Cat
- Dog
- Goldfish
```

```js
[ 'Cat', 'Dog', 'Goldfish' ]
```
:::

数组也可以采用行内表示法：

::: code-group
```yaml
animal: [Cat, Dog]
```

```js
{ animal: [ 'Cat', 'Dog' ] }
```
:::

### 纯量

最基本的、不可再分的值，包括：字符串、布尔值、整数、浮点数、Null、时间、日期。

- 数字直接以字面量的形式表示

  ::: code-group
  ```yaml
  int:
    - 123
    - 0b1010_0111_0100_1010_1110 #二进制表示
  float:
    - 3.14
    - 6.8523015e+5  #可以使用科学计数法
  ```

  ```js
  {
    int: [ 123, 0b1010_0111_0100_1010_1110 ],
    float: [ 3.14, 6.8523015e+5 ]
  }
  ```
  :::

- 布尔值用 true 和 false 表示

  ::: code-group
  ```yaml
  boolean:
    - true  #TRUE，True 都可以
    - false #FALSE，False 都可以
  ```

  ```js
  { boolean: [ true, false ] }
  ```
  :::

- Null 用 `~` 表示

  ::: code-group
  ```yaml
  parent: ~
  ```

  ```js
  { parent: null }
  ```
  :::

- 日期必须使用 ISO 8601 格式（即 yyyy-MM-dd）

  ::: code-group
  ```yaml
  date: 1976-07-31
  ```

  ```js
  { data: new Date('1976-07-31') }
  ```
  :::

- 时间使用 ISO 8601 格式

  时间和日期之间使用 `T` 连接，最后使用 `+` 代表时区。

  ::: code-group
  ```yaml
  datetime: 2018-02-17T15:02:31+08:00
  ```

  ```js
  { data: new Date('2018-02-17T15:02:31+08:00') }
  ```
  :::

- 字符串是最常见，也是最复杂的一种数据类型

  字符串默认不使用引号表示：

  ::: code-group
  ```yaml
  str: 这是一行字符串
  ```

  ```js
  { str: '这是一行字符串' }
  ```
  :::

  如果字符串中包含空格或特殊字符串，需要放在引号中：

  ::: code-group
  ```yaml
  str: '内容: 字符串'
  ```

  ```js
  { str: '内容: 字符串' }
  ```
  :::

  单引号或双引号都可以，双引号不会对特殊字符转义：

  ::: code-group
  ```yaml
  s1: '内容\n字符串'
  s2: "内容\n字符串"
  ```

  ```js
  { { s1: '内容\\n字符串', s2: '内容\n字符串' } }
  ```
  :::

  单引号之中如果还有单引号，必须连续使用两个单引号转义：

  ::: code-group
  ```yaml
  str: 'labor''s day'
  ```

  ```js
  { str: 'labor\'s day' }
  ```
  :::

  字符串可以写成多行，从第二行开始必须有一个单空格缩进，换行符会被转为空格：

  ::: code-group
  ```yaml
  str: 这是一段
   多行
   字符串
  ```

  ```js
  { str: '这是一段 多行 字符串' }
  ```
  :::

  多行字符串可以使用 `|` 保留换行符，也可以使用 `>` 折叠换行：

  ::: code-group
  ```yaml
  this: |
   Foo
   Bar
  that: >
   Foo
   Bar
  ```

  ```js
  { this: 'Foo\nBar\n', that: 'Foo Bar\n' }
  ```
  :::

  `+` 表示保留文字块末尾的换行，`-` 表示删除字符串末尾的换行：

  ::: code-group
  ```yaml
  s1: |
   Foo

  s2: |+
   Foo


  s3: |-
   Foo
  ```

  ```js
  { s1: 'Foo\n', s2: 'Foo\n\n\n', s3: 'Foo' }
  ```
  :::

  字符串之中可以插入 HTML 标记：

  ::: code-group
  ```yaml
  message: |

   <p style="color: red">
     段落
   </p>
  ```

  ```js
  { message: '\n<p style="color: red">\n  段落\n</p>\n' }
  ```
  :::

### 复杂结构

对象和数组可以结合使用，形成复杂结构：

::: code-group
```yaml
languages:
  - Ruby
  - Perl
  - Python
websites:
  YAML: yaml.org
  Ruby: ruby-lang.org
  Python: python.org
  Perl: use.perl.org
```

```js
{
  languages: [ 'Ruby', 'Perl', 'Python' ],
  websites: {
    YAML: 'yaml.org',
    Ruby: 'ruby-lang.org',
    Python: 'python.org',
    Perl: 'use.perl.org'
  }
}
```
:::

## 引用

锚点 `&` 和别名 `*`，可以用来引用：

```yaml
defaults: &defaults
  adapter: postgres
  host: localhost

development:
  database: myapp_development
  <<: *defaults

test:
  database: myapp_test
  <<: *defaults
```

上面代码等同于：

```yaml
defaults:
  adapter: postgres
  host: localhost

development:
  database: myapp_development
  adapter: postgres
  host: localhost

test:
  database: myapp_test
  adapter: postgres
  host: localhost
```

`&` 用来建立锚点，`<<` 表示合并到当前数据，`*` 用来引用锚点。

下面是另一个例子：

::: code-group
```yaml
- &showell Steve
- Clark
- Brian
- Oren
- *showell
```

```js
[ 'Steve', 'Clark', 'Brian', 'Oren', 'Steve' ]
```
:::
