<img src="https://i.loli.net/2020/08/18/HSa25hE1bdZ9gCM.jpg" />
<div align="center">
  <p>A feature-rich serverless comment library based on LeanCloud</p>
  <a href="https://github.com/ttttonyhe/nexment/actions?query=workflow%3ACI">
    <img src="https://github.com/ttttonyhe/nexment/workflows/CI/badge.svg" alt="github ci">
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

## Foreword

> **Note**
> This project is undergoing a major refactoring, stay tune for exciting updates to come.

<br/>

## See also
+ Nexment for Vue.js / Web Component [https://github.com/ttttonyhe/nexment-vue](https://github.com/ttttonyhe/nexment-vue)
+ Nexment for React.js [https://github.com/ttttonyhe/nexment](https://github.com/ttttonyhe/nexment)

<br/>

## Docs
Visit Nexment documentation site at [https://nexment.ouorz.com](https://nexment.ouorz.com)

<br/>

## Demo
Visit Nexment demo site at [https://nexment-demo.ouorz.com](https://nexment-demo.ouorz.com)

<br/>

## Installation
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
Add Nexment to your project dependencies
using Yarn:
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
import Nexment from "nexment"
```
Setup nexment configuration:
```js
const config = {
  pageKey: 'xxx' | undefined;
  features: {
		linkInput: true | false | undefined,
		replyListModal: true | false | undefined,
		replyEmailNotifications: true | false | undefined,
		descriptionTag: true | false | undefined,
	} | undefined,
  leancloud: {
    appId: 'xxx',
    appKey: 'xxx',
    serverURL: 'https://xxx.xxx',
  },
  admin: {
    name: 'xxx',
    email: 'xxx@xxx.xxx',
  },
  blackList:[{
    name: "xxx",
    email: "xxx",
    keyword: "xxx",
    link: "xxx"
  },
  {
    keyword: "xxx"
  }]
};
```
Use the nexment component:
```jsx
<Nexment config={config} />
```

<br/>

## Use Nexment in Next.js
Create a Nexment component(Nexment.tsx):
```tsx
import React from "react";
import Nexment from "nexment";

const Nexment = () => {
  const config = {
    pageKey: "xxx",
    features: {
			linkInput: true,
			replyListModal: true,
			replyEmailNotifications: true,
			descriptionTag: true,
		},
    leancloud: {
      appId: "xxx",
      appKey: "xxx",
      serverURL: "xxx",
    },
    admin: {
      name: "xxx",
      email: "xxx",
    },
    blackList:[
      {
        name: "xxx",
        email: "xxx",
        keyword: "xxx",
        link: "xxx"
      },
      {
        keyword: "xxx"
      }
    ]
  };
  return <Nexment config={config} />;
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

## Roadmap
See Github [projects→](https://github.com/ttttonyhe/nexment/projects)

<br/>

## Sponsor
Your name will be on the list [Sponsors](https://www.ouorz.com/sponsor)

<br/>

## Contribution
File an issue whenever you encountered a problem, pull requests are always welcomed
