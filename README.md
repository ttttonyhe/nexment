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