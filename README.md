# Sad-Dev Dairy

Although I feel very sad, but I have to admit that I've switched to TDSX which is a quick tool for Typescript library dev environment setup, by doing that I can fix the problem with Invalid React Hook which appears to be unfixable at this time by myself. Shame on me, I will figure out the real cause as soon as possible.
Let's just focus on development for now.


So interesting to find out that Typescript will complain whenever a name of Component doesn't starts with a capital letter.

```ts
import AV from './initiation';
import useSWR, { mutate } from 'swr';

export interface commentsItemType {
  ID: number;
  identifier: string;
  name: string;
  content: string;
  date: Date;
  replyList: commentsItemType[];
  hasReplies: boolean;
}

export const refetchData = (pageKey: string) => {
  mutate(pageKey);
};

/**
 * SWR component
 * using AsyncGet as the fetcher
 *
 * @param {string} pageKey
 * @returns {{
    commentsData: commentsItemType[],
    isLoading: boolean,
    isError: string,
  }};
 */
const useReplies = (
  ID: string
): {
  commentsData: commentsItemType[] | undefined;
  isLoading: boolean;
  isError: string;
} => {
  repeatCount = 0;
  const { data, error } = useSWR(ID, ListGet, {
    revalidateOnFocus: false,
  });
  return {
    commentsData: data,
    isLoading: !error && !data,
    isError: error,
  };
};

/**
 *  Fetch comments data from the cloud
 *
 * @param {number} queryKey
 * @returns {Promise<commentsItemType[]>}
 */
var repeatCount: number = 0;
const ListGet = async (queryKey: string): Promise<commentsItemType[]> => {
  // Maximum reply display depth 1
  if (repeatCount < 1) {
    const query = new AV.Query('nexment_comments');
    let combineData: commentsItemType[] = [];
    try {
      query.equalTo('reply', parseInt(queryKey));
      query.descending('createdAt');
      query.addDescending('ID');
      return await query.find().then(
        async (
          items: {
            /**
             * FIXME: a problem with Typescript union types usage
             * fix it later and as soon as possible
             */
            get: (arg0: string) => any;
            updatedAt: Date;
          }[]
        ) => {
          /**
           * NOTE: An interesting solution
           * using async/await in map function
           */
          const PromiseProcess = items.map(async item => {
            // Get all corresponding replies to the current comment
            let replyItemData: commentsItemType[] = [];
            if (item.get('hasReplies')) {
              await ListGet(item.get('ID')).then(replyItems => {
                repeatCount += 1;
                if (replyItems[0] !== undefined) {
                  replyItems.map(item => {
                    replyItemData.push(item);
                  });
                }
              });
            }
            const itemData = {
              ID: item.get('ID'),
              identifier: item.get('identifier'),
              name: item.get('name'),
              content: item.get('content'),
              date: item.updatedAt,
              replyList: replyItemData,
              hasReplies: item.get('hasReplies'),
            };
            combineData.push(itemData);
          });
          await Promise.all(PromiseProcess);
          return combineData;
        }
      );
    } catch (err) {
      return err;
    }
  } else {
    repeatCount = 0;
    return [];
  }
};

export default useReplies;

});
```

#### 功能实现清单

##### 基础功能

1. 标识页面 ID (内置 ID Generator 库，获取地址栏信息)
   1. [x] 不同页面同标识实现 (属性配置展示「当前展示另一页面数据」的提示)
2. 评论列表
   1. ~~最新评论在前 / 在后开关~~
   2. [x] 无限级评论 (展示两级，两级以上展示按钮弹窗加载新列表)
3. 评论内容框
   1. ~~滑动过评论框后展示简洁样式并固定~~
   2. MarkDown 支持
   3. 图片链接插入支持
      1. 滑块展示，左右按钮，最大 5 张，超过 5 张按钮弹窗加载新页面
      2. 图片点击展示大图，纯色背景上加载图片
   4. ~~公开性设置 (是否仅博主/评论者可见)~~
   5. [x] Emoji 选择
   6. [x] 昵称 (必填)
   7. [x] 邮箱 (必填)
   8. [x] 密码 (开启编辑功能必须设置密码，发布前提示。密码已设置提示输入密码，否则提示是否开启编辑功能)
   9. [x] 内容 (必填)
   10. [x] 重置回复
   11. [x] 回复
   12. 收到回复通知开关
   13. [x] 管理员配置及验证
   14. [x] 评论者 Tag
   15. [x] 评论者信息 Local storage 储存
   16. 管理模式
       1. 评论精选
       2. 评论 Label