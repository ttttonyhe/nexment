import leanCloud from './initiation';
import { nexmentConfigType } from 'components/container';
import converter from '../utils/showDown';
import fetch from 'unfetch';
import Qs from 'qs';
import * as EmailValidator from 'email-validator';
import similarity from 'string-similarity';

interface commentType {
  identifier: string;
  ID: number;
  name: string;
  email: string;
  content: any;
  tag?: string;
  reply?: number | undefined;
  replyOID?: string;
  ewr?: boolean;
  link?: string;
}

/**
 * Send email when receiving a reply
 *
 * @param {string} email
 * @param {string} url
 * @param {string} content
 */
const sendEmail = async (email: string, url: string, content: string) => {
  const opts = {
    method: 'POST', //请求方法
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const qeuryParams = Qs.stringify({
    toEmail: email,
    toContent: content,
    atUrl: url,
  });
  await fetch('https://node.ouorz.com/send/mail?' + qeuryParams, opts);
};

/**
 * Submit comment to LeanCloud
 *
 * @param {commentType} info
 * @param {nexmentConfigType} config
 * @returns {Promise<{ status: number; savedComment?: any }>}
 */
const useSavingComment = async (
  info: commentType,
  config: nexmentConfigType
): Promise<{ status: number; savedComment?: any }> => {
  // initialize leancloud storage
  const AV = leanCloud(
    config.leancloud.appId,
    config.leancloud.appKey,
    config.leancloud.serverURL
  );

  // Admin must be logged in
  if (
    (info.email === config.admin.email || info.name === config.admin.name) &&
    !AV.User.current()
  ) {
    return {
      status: 501,
    };
  }

  // check if all info has been provided
  if (
    info.identifier &&
    info.ID &&
    info.name &&
    info.email &&
    EmailValidator.validate(info.email) &&
    info.content
  ) {
    // loop through blacklist
    let i = 0;
    while (config.blackList && config.blackList[i]) {
      const rule = config.blackList[i];
      if (rule.email && info.email == rule.email) {
        return {
          status: 401,
        };
      }
      if (
        rule.name &&
        similarity.compareTwoStrings(info.name, rule.name) > 0.6
      ) {
        return {
          status: 401,
        };
      }
      if (rule.keyword && info.content.indexOf(rule.keyword) !== -1) {
        return {
          status: 401,
        };
      }
      if (
        rule.link &&
        info.link &&
        similarity.compareTwoStrings(info.link, rule.link) > 0.8
      ) {
        return {
          status: 401,
        };
      }
      ++i;
    }

    const commentsStorageClass = AV.Object.extend('nexment_comments');
    const commentsStorage = new commentsStorageClass();
    commentsStorage.set('identifier', info.identifier);
    commentsStorage.set('ID', info.ID);
    commentsStorage.set('name', info.name);
    commentsStorage.set('email', info.email);
    commentsStorage.set('content', info.content);

    // Current comment is a reply
    if (info.reply) {
      // Set reply ID for current comment
      commentsStorage.set('reply', info.reply);

      // Get reply-to comment object
      const replyToObject = await AV.Object.createWithoutData(
        'nexment_comments',
        info.replyOID
      );
      replyToObject.set('hasReplies', true);

      // Email when replied
      const query = new AV.Query('nexment_comments');
      const replyToEmailStatus = await query
        .get(info.replyOID)
        .then((item: { get: (arg0: string) => any }) => {
          return [item.get('emailWhenReplied'), item.get('email')];
        });
      if (replyToEmailStatus[0]) {
        sendEmail(
          replyToEmailStatus[1],
          window.location.href,
          converter.makeHtml('From ' + info.name + ' : ' + info.content)
        );
      }

      // Update the comment currently replying to
      await replyToObject.save().then(
        () => {
          console.log('Nexment: Comment sent successfully');
        },
        (error: any) => {
          console.log(error);
        }
      );
    }

    if (info.tag) {
      commentsStorage.set('tag', info.tag);
    }
    if (info.ewr) {
      commentsStorage.set('emailWhenReplied', info.ewr);
    }
    if (info.link) {
      commentsStorage.set('link', info.link.replace(/\s*/g, ''));
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
  } else {
    return {
      status: 500,
    };
  }
};

export default useSavingComment;
