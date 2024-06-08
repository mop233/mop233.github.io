---
title: '同一台电脑管理多个 GitHub 账户'
date: '2024-6-1'
category: '工程化'
tags: ['git']
detail: '介绍如何在同一台电脑上生成多个 SSH 密钥，并管理不同的 GitHub 账户。'
---

# 同一台电脑管理多个 GitHub 账户

有时候，你可能需要在同一台机器上管理多个 GitHub 账户。

但是，就算你在电脑中生成了多个 SSH Key，电脑在连接远程仓库的时候，只能默认选择其中固定的一个 SSH 公钥来连接，并不会根据不同仓库的设置选择不同的密钥。

这就导致了一台电脑默认只能访问一个 GitHub 账户，如果访问另一个 GitHub 账户，在 push 时就会报错。

下面介绍如何在同一台电脑上管理不同的 GitHub 账户。

## 1. 生成 SSH 密钥

在生成 SSH 密钥之前，我们可以检查一下当前电脑上是否有 SSH 密钥。

`ls -al ~/.ssh` 命令可以列出所有所有的公钥和私钥对。

如果 `~/.ssh/id_rsa` 存在且可用的话，我们可以使用它。否则我们可以先通过运行以下命令来生成一个默认的密钥：

```sh
$ ssh-keygen -t rsa
```

对于保存密钥的位置，按回车默认接受即可，它将默认保存在 `~/.ssh/` 目录中。让我们为个人账户使用这个默认的密钥对。

而对于工作账户，我们将使用下面的命令来创建不同的 SSH 密钥：

```sh
ssh-keygen -t rsa -C "email@work_mail.com" -f "id_rsa_work_user1"
```

至此，我们已经有了两个不同的密钥：

```
~/.ssh/id_rsa
~/.ssh/id_rsa_work_user1
```

## 2. 将 SSH 密钥添加到相应的 GitHub 账户中

我们已经准备好了 SSH 公钥，我们将要求 GitHub 账户信任我们创建的密钥。这是为了避免每次进行 Git 推送时都要输入用户名和密码的麻烦。

复制公钥 `pdcopy < ~/.ssh/id_rsa.pub`，然后登录你的个人 GitHub 账户：

- 转到【Settings】；
- 在左边的菜单中选择【SSH and GPG keys】；
- 点击【New SSH key】，提供一个合适的标题，并将密钥粘贴在下面的方框中；
- 点击【Add key】，就完成了。

对于工作账户，使用相应的公钥 `pdcopy < ~/.ssh/id_rsa_work_user1.pub`，在 GitHub 工作账户中重复上述步骤。

## 3. 在 ssh-agent 上注册新的 SSH 密钥

为了使用这些密钥，我们必须在我们电脑上的 ssh-agent 上注册它们。

如果你是使用的 Mac，执行下面命令确保 ssh-agent 运行：

```sh
$ eval "$(ssh-agent -s)"
```

然后执行：

```sh
$ ssh-add ~/.ssh/id_rsa
$ ssh-add ~/.ssh/id_rsa_work_user1
```

就可以把密钥添加到 ssh-agent 中了。

如果你是使用的 Windows，打开 Git Bash 命令行，依次执行下面的命令添加：

```sh
$ exec ssh-agent bash
$ eval ssh-agent -s
$ ssh-add ~/.ssh/id_rsa
$ ssh-add ~/.ssh/id_rsa_work_user1
```

## 4. 让 ssh-agent 为不同的 SSH 主机使用各自的 SSH 密钥

这是最关键的部分，我们有两种不同的方法。

一种是使用 SSH 配置文件。另一种是让 ssh-agent 每次只有一个有效的 SSH 密钥。

### 方法一：创建 SSH 配置文件

在这里，我们实际上是为不同的主机添加 SSH 配置规则，说明在哪个域名使用哪个身份文件。

SSH 配置文件将在 `~/.ssh/config` 中。如果有的话，请编辑它，否则我们可以直接创建它。

```sh
$ cd ~/.ssh/
$ touch config           // Creates the file if not exists
$ code config            // Opens the file in VS code, use any editor
```

在 config 文件中为相关的 GitHub 账号做类似于下面的配置项：

```
# Personal account, - the default config
Host github.com
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa

# Work account-1
Host github.com-work_user1
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa_work_user1
```

`work_user1` 是工作账户的 GitHub 用户 ID。`github.com-work_user1` 是用来区分多个 Git 账户的记号。你也可以使用 `work_user1.github.com` 记号。确保与你使用的主机名记号一致。当你克隆一个仓库或为本地仓库设置 `remote origin` 时，这一点很重要。

上面的配置要求 ssh-agent：

- 对任何使用 `@github.com` 的 Git URL 使用 `id_rsa` 密钥
- 对任何使用 `@github.com-work_user1` 的 Git URL 使用 `id_rsa_work_user1` 密钥

### 方法二：在 ssh-agent 中每次有一个活跃的 SSH 密钥

这种方法不需要 SSH 配置规则（即不需要 `~/.ssh.config` 文件）。

我们手动确保在进行任何 Git 操作时，ssh-agent 中只有相关的密钥。

`ssh-add -l` 命令会列出所有连接到 ssh-agent 的 SSH 密钥。把它们全部删掉，然后添加你要用的那个密钥即可。比如，要推送到个人的 Git 账号，可以执行如下命令：

```sh
$ ssh-add -D    //removes all ssh entries from the ssh-agent
$ ssh-add ~/.ssh/id_rsa   // Adds the relevant ssh key
```

现在 ssh-agent 已经有了映射到个人 GitHub 账户的密钥，我们可以向个人仓库进行 Git 推送了。

要推送到工作的 GitHub account-1，需要改变 SSH 密钥与 ssh-agent 的映射关系，删除现有的密钥，并添加与 GitHub 工作账号映射的 SSH 密钥：

```sh
ssh-add -D
ssh-add ~/.ssh/id_rsa_work_user1
```

目前，ssh-agent 已经将密钥映射到工作的 GitHub 账户，你可以将 Git 推送到工作仓库，不过需要一点手动操作。

## 5. 在本地仓库设置 git remote url

一旦我们克隆/创建了本地的 Git 仓库，确保 Git 配置的用户名和电子邮件正是你想要的。GitHub 会根据提交（commit）描述所附的电子邮件 ID 来识别任何提交的作者。

要列出本地 Git 目录中的配置名称和电子邮件，请执行 `git config user.name` 和 `git config user.email`。如果没有找到，可以进行更新：

```sh
$ git config user.name "User 1"   // Updates git config user name
$ git config user.email "user1@workMail.com"
```

## 6. 克隆仓库

现在配置已经好了，我们可以克隆相应的仓库了。在克隆时，注意我们要使用在 SSH 配置中使用的主机。

要克隆个人仓库，使用命令：

```sh
$ git clone git@github.com:personal_account_name/repo_name.git
```

要克隆工作仓库，使用命令：

```sh
$ git clone git@github.com-work_user1:work_user1/repo_name.git
```

这个变化取决于 `~/.ssh/config` 文件中的 Host 配置项（不是 HostName！！），`@` 和 `:` 之间的字符串应该与我们在 SSH 配置文件中给出的内容相匹配。

## 7. 对于本地存在的版本库

- 如果有已经克隆的仓库

  可以使用 `git remote -v` 命令来列出该仓库的 Git remote。

  然后检查该 URL 是否与我们要使用的 GitHub 主机相匹配，如果不匹配，就更新 remote origin URL：

  ```sh
  $ git remote set-url origin git@github.com-worker_user1:worker_user1/repo_name.git
  ```

  确保 `@` 和 `:` 之间的字符串与我们在 SSH 配置中给出的主机一致。

- 如果要在本地创建新仓库

  使用 `git init` 命令在项目文件夹中初始化 Git。

  在 GitHub 账户中创建新的仓库，然后将其作为 Git remote 添加给本地仓库：

  ```sh
  $ git remote add origin git@github.com-work_user1:work_user1/repo_name.git
  ```

  确保 `@` 和 `:` 之间的字符串与我们在 SSH 配置中给出的主机一致。

  推送初始提交到 GitHub 仓库：

  ```sh
  $ git add .
  $ git commit -m "Initial commit"
  $ git push -u origin master
  ```


