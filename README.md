<img src="https://i.loli.net/2020/08/18/HSa25hE1bdZ9gCM.jpg" />
<div align="center">
  <p>A feature-rich serverless comment library based on LeanCloud</p>
  <a href="https://github.com/HelipengTony/nexment/actions?query=workflow%3ACI">
    <img src="https://github.com/HelipengTony/nexment/workflows/CI/badge.svg" alt="github ci">
  </a>
  <a href="https://www.npmjs.com/package/nexment">
    <img src="https://img.shields.io/npm/dw/nexment" alt="npm downloads">
  </a>
  <a href="https://www.npmjs.com/package/nexment">
    <img src="https://img.shields.io/npm/l/nexment" alt="license">
  </a>
</div>

<br/>

<br/>

## See also
+ Nexment for Vue.js / Web Component [https://github.com/HelipengTony/nexment-vue](https://github.com/HelipengTony/nexment-vue)
+ Nexment for React.js [https://github.com/HelipengTony/nexment](https://github.com/HelipengTony/nexment)

<br/>

## Docs
Visit Nexment documentation site at [https://nexment.ouorz.com](https://nexment.ouorz.com)

<br/>

## Demo
Visit Nexment demo site at [https://nexment-demo.ouorz.com](https://nexment-demo.ouorz.com)

<br/>

## Installation
Nexment is currently only available for React.js projects, Vue version is WIP.
### Part I - LeanCloud
1. Register / Login [LeanCloud](https://leancloud.cn/dashboard/login.html#/signup)
2. Create an App in [Dashboard](https://leancloud.cn/dashboard/applist.html#/apps)
3. Go to Your App => **LeanStorage** tab => Objects
4. Create a class named "test" using default settings
5. Go to Your App => **Settings** tab => App keys
6. Copy AppID and AppKey
7. Configure REST API Server URL. For configuration instructions, see [How to Specify API Server URL (Chinese)](https://leancloud.cn/docs/custom-api-domain-guide.html#hash810845114)
8. Go to Your App => **Settings** tab => Security and add your project domain to Web secure domains

<br/>

### Part II - Nexment
Add Nexment to your project
dependencies using Yarn:
```shell
yarn add nexment
```
or using NPM:
```shell
npm install nexment
```

Use Nexment in your project:

Import nexment library:
```js
import { NexmentContainer } from "nexment"
```
Setup nexment configuration:
```js
const config = {
  pageKey: 'xxx' | undefined;
  enableLinkInput: true | false | undefined,
  enableReplyListModal: true | false | undefined,
  leancloud: {
    appId: 'xxx',
    appKey: 'xxx',
    serverURL: 'https://xxx.xxx',
  },
  admin: {
    name: 'xxx',
    email: 'xxx@xxx.xxx',
  },
};
```
Use the nexment component:
```jsx
<NexmentContainer config={config} />
```

<br/>

## Use Nexment in Next.js
Create a Nexment component(Nexment.tsx):
```tsx
import React from "react";
import { NexmentContainer } from "nexment";

const Nexment = () => {
  const config = {
    pageKey: "xxx",
    enableLinkInput: true,
    enableReplyListModal: false,
    leancloud: {
      appId: "xxx",
      appKey: "xxx",
      serverURL: "xxx",
    },
    admin: {
      name: "xxx",
      email: "xxx",
    },
  };
  return <NexmentContainer config={config} />;
};

export default Nexment;
```

import this Nexment component anywhere in your project using "next/dynamic":
```tsx
import dynamic from "next/dynamic";
const NexmentDiv = dynamic(() => import("./Nexment"), {
  ssr: false,
});

const Index = () =>{
  return (
    <div>
      <NexmentDiv />
    </div>
  )
}

export default Index;
```

<br/>

## TypeScript Support
Nexment for React has full support for TypeScript type-checking

<br/>

## Todo
1. 管理模式
    1. [ ] 评论精选
    2. [ ] 评论 Label
    3. [ ] 评论过滤
    4. [ ] 评论折叠
    5. [ ] 更完善的静态类型
2. i18n
   1. [x] 文本翻译

<br/>

## Donation
Your name will be on the list [Donation](https://www.ouorz.com/donation)
<br/>

![Donate](https://i.loli.net/2019/02/18/5c6a80afd1e26.png)

<br/>

File an issue if you encountered any problem
<br/>
I will reply you as soon as possible