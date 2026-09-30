# 校园失物招领系统

软件工程结对作业项目。

## 技术栈

- [Expo SDK 55](https://expo.dev)（React Native 0.83、React 19）
- TypeScript
- Expo Router（文件式路由，代码在 `src/app`）
- [NativeWind](https://www.nativewind.dev/) v4 + Tailwind CSS v3

## 环境要求

- Node.js ≥ 20（建议通过 nvm 安装）
- yarn 1.22.22

## 快速开始

```bash
yarn install
yarn start        # 启动 Metro，按提示在模拟器/真机/浏览器中打开
```

也可以直接：

```bash
yarn android      # Android 模拟器/真机
yarn ios          # iOS 模拟器（需要 macOS + Xcode）
yarn web          # 浏览器
```

> 手机上用 [Expo Go](https://expo.dev/go) 扫终端里的二维码即可预览。

## 目录结构

```
├── app.json                # Expo 应用配置
├── babel.config.js         # Babel 配置
├── metro.config.js         # Metro 配置
├── tailwind.config.js      # Tailwind / NativeWind 配置
├── global.css              # NativeWind 样式入口
├── assets/                 # 图标、启动图等静态资源
├── docs/                   # 作业文档与设计稿
└── src/
    ├── app/                # Expo Router 页面（文件式路由）
    ├── components/         # 通用组件
    ├── constants/          # 主题常量
    └── hooks/              # 自定义 Hooks
```

## About

**202601-software-engineering-pairing-homework** © [@renbaoshuo](https://github.com/renbaoshuo) & [@daxuemangongdao](https://github.com/daxuemangongdao)<br />
This is an academic assignment, not an open-source project. No license is provided. The code is for viewing only and may not be copied, modified, or reused.

> [Personal Website](https://baoshuo.ren) · [Blog](https://blog.baoshuo.ren) · GitHub [@renbaoshuo](https://github.com/renbaoshuo) · Twitter [@renbaoshuo](https://twitter.com/renbaoshuo)
