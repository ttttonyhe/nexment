import AV from './initiation';

interface commentsItemType {
  ID: number | string | Date;
  identifier: number | string | Date;
  name: number | string | Date;
  content: number | string | Date;
  date: number | string | Date;
}

/**
 *  Fetch comments data from the cloud
 *
 * @param {string} pageKey
 * @returns {Promise<{ status: number; commentsData?: commentsItemType[] }>}
 */
const AsyncGet = async (
  pageKey: string
): Promise<{ status: number; commentsData?: commentsItemType[] }> => {
  const query = new AV.Query('nexment_comments');
  let combineData: commentsItemType[] = [];
  try {
    query.equalTo('identifier', pageKey);
    return await query.find().then(
      (
        items: {
          get: (arg0: string) => number | string | Date;
          updatedAt: Date;
        }[]
      ) => {
        items.map(item => {
          const itemData = {
            ID: item.get('ID'),
            identifier: item.get('identifier'),
            name: item.get('name'),
            content: item.get('content'),
            date: item.updatedAt,
          };
          combineData.push(itemData);
        });
        return {
          status: 200,
          commentsData: combineData,
        };
      }
    );
  } catch (err) {
    return {
      status: 500,
    };
  }
};
/**
 *  Entry function
 *
 * @param {string} pageKey
 * @returns
 */
const getCommentsList = (pageKey: string) => {
  return AsyncGet(pageKey);
};

export default getCommentsList;
