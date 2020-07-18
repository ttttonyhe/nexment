import AV from './initiation';

interface commentType {
  identifier: string;
  ID: number;
  name: string;
  email: string;
  content: any;
  reply?: number | undefined;
  replyOID?: string;
  tags?: [] | undefined;
}

const useSavingComment = async (
  config: commentType
): Promise<{ status: number; savedComment?: any }> => {
  const commentsStorageClass = AV.Object.extend('nexment_comments');
  const commentsStorage = new commentsStorageClass();
  commentsStorage.set('identifier', config.identifier);
  commentsStorage.set('ID', config.ID);
  commentsStorage.set('name', config.name);
  commentsStorage.set('email', config.email);
  commentsStorage.set('content', config.content);
  if (config.reply !== undefined) {
    commentsStorage.set('reply', config.reply);
    const replyToObject = await AV.Object.createWithoutData(
      'nexment_comments',
      config.replyOID
    );
    replyToObject.set('hasReplies', true);
    await replyToObject.save().then(
      () => {
        console.log('nb');
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  if (config.tags !== undefined) {
    commentsStorage.set('tag', config.tags);
  }
  return await commentsStorage.save().then(
    (savedComment: any) => {
      return {
        status: 201,
        savedComment: savedComment,
      };
    },
    () => {
      // 异常处理
      return {
        status: 500,
      };
    }
  );
};

export default useSavingComment;
