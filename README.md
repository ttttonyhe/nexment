# Nexment
> Another lovely serverless comments library for React based on LeanCloud

![nexment_banner](https://i.loli.net/2020/07/29/ODkqtseAU6KJGxB.png)

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
  enableLinkInput: true | undefined,
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

## Todo
1. 管理模式
    1. [ ] 评论精选
    2. [ ] 评论 Label
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