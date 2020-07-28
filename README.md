# Nexment
> Another lovely comments library based on LeanCloud

<br/>

## Installation
Nexment is currently only available for React.js projects, Vue version is WIP.
### Part I - LeanCloud
1. Register / Login [LeanCloud](https://leancloud.cn/dashboard/login.html#/signup)
2. Create an App in [Dashboard](https://leancloud.cn/dashboard/applist.html#/apps)
3. Go to Your App => **LeanStorage** tab => Objects
4. Create a class named "nexment_comments" using default settings
5. Go to Your App => **Settings** tab => App keys
6. Copy AppID and AppKey
7. Configure REST API Server URL. For configuration instructions, see [How to Specify API Server URL (Chinese)](https://leancloud.cn/docs/custom-api-domain-guide.html#hash810845114)

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
1.  管理模式
    1. 评论精选
    2. 评论 Label