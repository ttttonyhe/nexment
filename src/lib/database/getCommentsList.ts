import AV from './initiation';
import useSWR from 'swr';

export interface commentsItemType {
  ID: number;
  identifier: string;
  name: string;
  content: string;
  date: Date;
  replyList: commentsItemType[];
}

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
const useComments = (
  pageKey: string
): {
  commentsData: commentsItemType[] | undefined;
  isLoading: boolean;
  isError: string;
} => {
  const { data, error } = useSWR(pageKey, ListGet);
  return {
    commentsData: data,
    isLoading: !error && !data,
    isError: error,
  };
};

/**
 *  Fetch comments data from the cloud
 *
 * @param {string | number} queryKey
 * @returns {Promise<commentsItemType[]>}
 */
const ListGet = async (
  queryKey: string | number
): Promise<commentsItemType[]> => {
  const query = new AV.Query('nexment_comments');
  let combineData: commentsItemType[] = [];
  try {
    if (typeof queryKey === 'string') {
      // querykey is of type string, querying identifier
      query.equalTo('identifier', queryKey)
    } else {
      // querykey is of type number, querying replies
      query.equalTo('reply', queryKey);
    }
    query.descending('createdAt');
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
          if (
            (item.get('reply') === undefined && typeof queryKey === 'string') ||
            typeof queryKey === 'number'
          ) {
            // Get all corresponding replies to the current comment
            let replyItemData: commentsItemType[] = [];
            await ListGet(item.get('ID')).then(replyItems => {
              if (replyItems[0] !== undefined) {
                replyItems.map(item => {
                  replyItemData.push(item);
                });
              }
              const itemData = {
                ID: item.get('ID'),
                identifier: item.get('identifier'),
                name: item.get('name'),
                content: item.get('content'),
                date: item.updatedAt,
                replyList: replyItemData,
              };
              combineData.push(itemData);
            });
          }
        });
        await Promise.all(PromiseProcess);
        return combineData;
      }
    );
  } catch (err) {
    return err;
  }
};

export default useComments;
