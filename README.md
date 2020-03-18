# pomodoro 

🍅番茄工作法+时间记录法

## 介绍

结合了两种效率工作法的在线工具

[番茄工作法](https://zh.wikipedia.org/wiki/%E7%95%AA%E8%8C%84%E5%B7%A5%E4%BD%9C%E6%B3%95): 25分钟的工作时间和5分钟的休息时间，通过专注提升工作效率。

[奇特的一生](https://book.douban.com/subject/1115353/): 通过记录时间的流逝，提升感知时间的能力，从而更好的规划工作生活。

## 使用流程

[https://pomodoros.app](https://pomodoros.app)

### 准备工作

点击右上角的分类编辑按钮，设定自己的工作组成，并设定每周目标

### 开始使用

点击左上角的添加按钮，选择分类，开始一个新的番茄工作时间，25分钟到达后，将会通过系统通知的方式提醒你时间截止，在标题中输入这个番茄时间段所做的工作，点击提交，完成一个番茄🍅

## 开发

项目使用[NextJS](https://nextjs.org)开发。数据库存储使用腾讯云提供的“云开发”。

新建`.env`文件填写云开发和GitHub OAuth的配置信息

```
TCB_ENV="pomodoro-xxxx"
TCB_AK="AKIDyhFYbPUHxxxxxxx"
TCB_SK="zjETSHq9CzYxxxxxxxx"
GITHUB_CLIENT_ID="0f8812dexxxxx"
GITHUB_CLIENT_SECRET="12a2dff1a85xxxxx"
```

然后运行`yarn dev`

## 部署

### 腾讯云-云函数

根据`cloudbaserc.sample.js`创建自己的`cloudbaserc.js`

安装腾讯云cloudbase工具，然后执行

```
yarn build && tcb functions:deploy pomodoro
```

### now.sh

参照`now.json`文件设置secret后，执行

```
now --prod
```
