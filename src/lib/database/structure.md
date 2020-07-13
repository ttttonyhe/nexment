const AV = require("leancloud-storage");

AV.init({
  appId: "6Kcb9HB1iOR87HUbAvnMyUER-gzGzoHsz",
  appKey: "zf3gAf9CGIHLL8Crctb0sJLV",
  serverURL: "https://leancloud.ouorz.com",
});

// 声明 class
const Test = AV.Object.extend("Test");

// 构建对象
const testOb = new Test();

// 为属性赋值
testOb.set("title", "工程师周会");
testOb.set("content", "周二两点，全体成员");

export default { testOb: testOb, AV: AV };
