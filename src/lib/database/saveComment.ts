import leanCloud from './initiation';
import { nexmentConfigType } from 'components/container';

interface commentType {
  identifier: string;
  ID: number;
  name: string;
  email: string;
  content: any;
  tag?:string,
  reply?: number | undefined;
  replyOID?: string;
}

const useSavingComment = async (
  info: commentType,
  config: nexmentConfigType
): Promise<{ status: number; savedComment?: any }> => {
  const AV = leanCloud(
    config.leancloud.appId,
    config.leancloud.appKey,
    config.leancloud.serverURL
  );
  // Determine whether the sender is admin
  if (
    (info.email === config.admin.email || info.name === config.admin.name) &&
    !AV.User.current()
  ) {
    return {
      status: 501,
    };
  } else {
    const commentsStorageClass = AV.Object.extend('nexment_comments');
    const commentsStorage = new commentsStorageClass();
    commentsStorage.set('identifier', info.identifier);
    commentsStorage.set('ID', info.ID);
    commentsStorage.set('name', info.name);
    commentsStorage.set('email', info.email);
    commentsStorage.set('content', info.content);
    if (info.reply !== undefined) {
      commentsStorage.set('reply', info.reply);
      const replyToObject = await AV.Object.createWithoutData(
        'nexment_comments',
        info.replyOID
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
    if (info.tag !== undefined) {
      commentsStorage.set('tag', info.tag);
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
  }
};

export default useSavingComment;
