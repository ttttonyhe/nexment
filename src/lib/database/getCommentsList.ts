import leanCloud from './initiation';
import { Queriable } from 'leancloud-storage';
import useSWR, { mutate } from 'swr';
import { nexmentConfigType } from '../../components/container';

export interface commentsItemType {
  OID: string;
  ID: number;
  identifier: string;
  name: string;
  content: string;
  date: Date;
  email: string;
  tag: string;
  replyList: commentsItemType[];
  hasReplies: boolean;
  link: string;
}

/**
 * Refetch data using SWR
 *
 * @param {string} pageKey
 */
export const refetchData = (pageKey: string) => {
  mutate(pageKey);
};

/**
 * SWR component
 * using AsyncGet as the fetcher
 *
 * @param {string} pageKey
 * @param {nexmentConfigType} config
 * @returns {({
 *   commentsData: commentsItemType[] | undefined;
 *   isLoading: boolean;
 *   isError: string;
 * })}
 */
const useComments = (
  pageKey: string,
  config: nexmentConfigType
): {
  commentsData: commentsItemType[] | undefined;
  isLoading: boolean;
  isError: string;
} => {
  const AV = leanCloud(
    config.leancloud.appId,
    config.leancloud.appKey,
    config.leancloud.serverURL
  );
  /**
   *  Fetch comments data from the cloud
   *
   * @param {string | number} queryKey or replyID
   * @returns {Promise<commentsItemType[]>}
   */
  const ListGet = async (
    queryKey: string | number
  ): Promise<commentsItemType[]> => {
    // Maximum reply display depth 2
    const query = new AV.Query('nexment_comments');
    let combineData: commentsItemType[] = [];
    let repliesData: any[] = [];

    // querykey is of type string, querying identifier
    query.equalTo('identifier', queryKey);
    query.descending('createdAt');

    return await query.find().then(async (items: Queriable[]) => {
      // Store all reply data
      items.map(async item => {
        if (item.get('reply') !== undefined) {
          if (repliesData[item.get('reply').toString()] === undefined) {
            repliesData[item.get('reply').toString()] = [];
          }
          repliesData[item.get('reply').toString()].push({
            OID: item.get('objectId'),
            ID: item.get('ID'),
            identifier: item.get('identifier'),
            name: item.get('name'),
            content: item.get('content'),
            date: item.createdAt,
            email: item.get('email'),
            tag: item.get('tag'),
            link: item.get('link'),
            hasReplies: item.get('hasReplies'),
          });
        }
      });
      // Construct list structure
      items.map(async item => {
        if (
          (item.get('reply') === undefined && typeof queryKey === 'string') ||
          typeof queryKey === 'number'
        ) {
          // Get reply list recursively
          const repliesRecursion = (replyItemData: any[]) => {
            (replyItemData || []).map(item => {
              if (item.hasReplies) {
                item['replyList'] = repliesRecursion(
                  repliesData[item.ID.toString()]
                );
              }
            });
            return replyItemData.reverse();
          };
          // Get all corresponding replies of current comment
          let replyItemData: any[] = [];
          if (item.get('hasReplies')) {
            replyItemData = repliesData[item.get('ID').toString()];
            replyItemData = repliesRecursion(replyItemData);
          }
          const itemData = {
            OID: item.get('objectId'),
            ID: item.get('ID'),
            identifier: item.get('identifier'),
            name: item.get('name'),
            content: item.get('content'),
            date: item.createdAt || new Date(),
            replyList: replyItemData,
            email: item.get('email'),
            tag: item.get('tag'),
            link: item.get('link'),
            hasReplies: item.get('hasReplies'),
          };
          combineData.push(itemData);
        }
      });
      return combineData;
    });
  };
  const { data, error } = useSWR(pageKey, ListGet);
  return {
    commentsData: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useComments;
