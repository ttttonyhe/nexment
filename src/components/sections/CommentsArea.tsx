import React from 'react';
import Floater from 'react-floater';
import usingSaveComment from '../../lib/database/saveComment';
import generateCommentID from '../../lib/utils/generateCommentID';
import { refetchData } from '../../lib/database/getCommentsList';
import EmojiCard from '../controls/emojiCard/index';
import VerificationModal from '../modal/verification';
import leanCloud from '../../lib/database/initiation';
import { reactLocalStorage } from 'reactjs-localstorage';
import TagCard from '../controls/tagCard';
import TextareaAutosize from 'react-textarea-autosize';
import Icons from '../icons/index';
import translate from '../../lib/translation/index';
import Context, { NexmentConfig } from '../../lib/utils/configContext';
import insertTextAtCursor from 'insert-text-at-cursor';
import converter from '../../lib/utils/showDown';

import '../../assets/style/commentarea.scss';

/**
 * Nexment Comment area
 *
 * @param {({
 *   pageKey: string;
 *   replyTo: number | undefined;
 *   replyToOID: string | undefined;
 *   replyToName: string | undefined;
 *   primaryReplyTo: number | undefined;
 *   primaryReplyToOID: string | undefined;
 *   primaryReplyToName: string | undefined;
 *   random?: number;
 *   reloadFunc?: Function;
 * })} Props
 * @returns
 */
const CommentsArea = (Props: {
  pageKey: string;
  replyTo: number | undefined;
  replyToOID: string | undefined;
  replyToName: string | undefined;
  primaryReplyTo: number | undefined;
  primaryReplyToOID: string | undefined;
  primaryReplyToName: string | undefined;
  random?: number;
  reloadFunc?: Function;
}) => {
  // Configs
  const NexmentConfigs: NexmentConfig = React.useContext(Context);

  // Translation
  const Translation = translate.use().text;

  // Initialize leancloud storage
  const AV = leanCloud(
    NexmentConfigs.leancloud.appId,
    NexmentConfigs.leancloud.appKey,
    NexmentConfigs.leancloud.serverURL
  );

  // Get initial replyto / replytoOID
  const primaryReplyTo = Props.primaryReplyTo;
  const primaryReplyToOID = Props.primaryReplyToOID;
  const primaryReplyToName = Props.primaryReplyToName;

  // Get commenter info from local storage
  const getCommenterInfo = (type: string) => {
    if (reactLocalStorage.getObject('nexment-commenterInfo')) {
      return reactLocalStorage.getObject('nexment-commenterInfo')[type];
    } else {
      if (type === 'ewr') {
        return false;
      } else {
        return '';
      }
    }
  };
  // Store commenter info in local storage
  const setCommenterInfo = (info: {
    name: string;
    email: string;
    tag: string;
    link?: string;
    ewr?: boolean;
  }) => {
    reactLocalStorage.setObject('nexment-commenterInfo', info);
  };

  // Current comment states
  const [commentName, setCommentName] = React.useState<string>(
    AV.User.current()
      ? AV.User.current().attributes.username
      : getCommenterInfo('name')
  );
  const [commentEmail, setCommentEmail] = React.useState<string>(
    AV.User.current()
      ? AV.User.current().attributes.email
      : getCommenterInfo('email')
  );
  const [commentLink, setCommentLink] = React.useState<string>(
    getCommenterInfo('link')
  );

  const [commentContent, setCommentContent] = React.useState<string>('');
  const [commentTag, setCommentTag] = React.useState<string>(
    getCommenterInfo('tag')
  );
  const [commentEwr, setCommentEwr] = React.useState<boolean>(
    getCommenterInfo('ewr')
  );

  // Resetting state
  const [resetStatus, setResetStatus] = React.useState<boolean>(false);

  // Modal state
  const [modalStatus, setModalStatus] = React.useState<boolean>(false);

  // Markdown preview state
  const [previewStatus, setPreviewStatus] = React.useState<boolean>(false);

  /**
   * Listen to replyTo / random change
   * random is a random number
   * designed to make reset status false when replying to the previous comment
   */
  React.useEffect(() => {
    setResetStatus(false);
  }, [Props.replyTo, Props.random]);

  // Input change handlers
  const handleNameChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentName(e.target.value);
    if (e.target.value === NexmentConfigs.admin.name && !AV.User.current()) {
      setModalStatus(true);
    }
  };
  const handleEmailChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentEmail(e.target.value);
    if (e.target.value === NexmentConfigs.admin.email && !AV.User.current()) {
      setModalStatus(true);
    }
  };
  const handleLinkChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentLink(e.target.value);
  };
  const handleContentChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentContent(e.target.value);
  };
  const handleTagChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentTag(e.target.value);
  };

  // Comment submitting function
  const sendComment = async () => {
    if (Props.reloadFunc) {
      Props.reloadFunc(true);
    }

    let replyingTo = resetStatus ? primaryReplyTo : Props.replyTo;
    let replyingToOID = resetStatus ? primaryReplyToOID : Props.replyToOID;
    let thisID = generateCommentID().idData;
    const returnData = await usingSaveComment(
      {
        ID: thisID,
        identifier: Props.pageKey,
        name: commentName,
        email: commentEmail,
        link: commentLink ? commentLink : undefined,
        content: commentContent,
        tag: commentTag,
        reply: replyingTo,
        replyOID: replyingToOID,
        ewr: commentEwr,
      },
      NexmentConfigs
    );

    if (returnData.status === 500) {
      alert(
        'Nexment: An error occurred while submitting your comment.\nPlease check if you have entered the correct information.'
      );
    } else if (returnData.status === 501) {
      setModalStatus(true);
    } else if (returnData.status === 401) {
      alert(
        'Nexment: An error occurred while submitting your comment.\nYour comment has been identified as a spam.'
      );
    } else {
      // Comment success
      // Store commenter info
      setCommenterInfo({
        name: commentName,
        email: commentEmail,
        tag: commentTag,
        link: commentLink,
        ewr: commentEwr,
      });
      // Set content to empty
      setCommentContent('');
      // Refetch data using swr mutate
      await refetchData(Props.pageKey);
      // Jump to replied to/comment item
      if (replyingTo) {
        window.location.href = '#' + replyingTo;
      } else {
        window.location.href = '#' + thisID;
      }
      resetReplyTo();
    }

    if (Props.reloadFunc) {
      Props.reloadFunc(false);
    }
  };

  // Reset reply to initial
  const resetReplyTo = () => {
    setResetStatus(true);
  };

  // Get who are we replying to
  const getReplyTo = () => {
    if (resetStatus) {
      return primaryReplyToName;
    } else {
      return Props.replyToName;
    }
  };

  // Reply className
  const getReplyDisplay = () => {
    if (resetStatus) {
      if (primaryReplyToName) {
        return 'nexment-replying';
      } else {
        return '';
      }
    } else {
      if (primaryReplyToName || Props.replyToName) {
        return 'nexment-replying';
      } else {
        return '';
      }
    }
  };

  // Create a ref for textarea
  const nexmentTextarea: any = React.useRef();

  // Process data sending from content addons, insert content at cursor
  const handleAddon = (content: string) => {
    // Insert emoji at cursor
    insertTextAtCursor(nexmentTextarea.current, content);
  };

  return (
    <div className="nexment-comment-area" id="nexment-comment-area">
      <div className="nexment-comment-area-top">
        <input
          placeholder={commentName ? commentName : Translation.name}
          onChange={handleNameChange}
        ></input>
        <input
          placeholder={commentEmail ? commentEmail : Translation.email}
          onChange={handleEmailChange}
        ></input>
        {NexmentConfigs.enableLinkInput ? (
          <input
            placeholder={commentLink ? commentLink : Translation.link}
            onChange={handleLinkChange}
          ></input>
        ) : (
          ''
        )}
      </div>
      <div className="nexment-comment-area-middle">
        <TextareaAutosize
          value={commentContent}
          placeholder={Translation.placeHolder + '...'}
          onChange={handleContentChange}
          className={previewStatus ? 'nexment-previewing' : ''}
          ref={nexmentTextarea}
        />
        {previewStatus ? (
          <div
            className="nexment-md-preview markdown-body"
            dangerouslySetInnerHTML={{
              __html: converter.makeHtml(
                commentContent ? commentContent : Translation.nothing
              ),
            }}
          ></div>
        ) : (
          ''
        )}
      </div>
      <div className="nexment-comment-area-bottom">
        <div>
          <Floater
            offset={5}
            eventDelay={0}
            placement="top"
            event="hover"
            content={Translation.resetReply}
          >
            <button onClick={resetReplyTo} className={getReplyDisplay()}>
              {getReplyDisplay() === 'nexment-replying'
                ? Icons().resetFill
                : Icons().resetReply}
              <em>{getReplyTo()}</em>
              <b>{Icons().cancel}</b>
            </button>
          </Floater>
          <Floater
            offset={5}
            eventDelay={0}
            placement="top"
            event="hover"
            content="Emoji"
          >
            <EmojiCard handler={handleAddon} />
          </Floater>
          {NexmentConfigs.descriptionTag && (
            <Floater
              offset={5}
              eventDelay={0}
              placement="top"
              event="hover"
              content={Translation.desTag}
            >
              <TagCard tag={commentTag} handler={handleTagChange}></TagCard>
            </Floater>
          )}
          {NexmentConfigs.enableReplyEmail && (
            <Floater
              placement="top"
              event="hover"
              content={commentEwr ? Translation.unSub : Translation.sub}
              offset={5}
              eventDelay={0}
            >
              <button
                onClick={() => {
                  setCommentEwr(!commentEwr);
                }}
              >
                {commentEwr ? Icons().email : Icons().emailFill}
              </button>
            </Floater>
          )}
          <Floater
            offset={5}
            eventDelay={0}
            placement="top"
            event="hover"
            content={Translation.avatar}
          >
            <button>
              <a
                href="https://cn.gravatar.com/support/what-is-gravatar"
                target="_blank"
              >
                {Icons().avatar}
              </a>
            </button>
          </Floater>
          <Floater
            offset={5}
            eventDelay={0}
            placement="top"
            event="hover"
            content={
              previewStatus ? Translation.stopPreview : Translation.mdPreview
            }
          >
            <button
              onClick={() => {
                setPreviewStatus(!previewStatus);
              }}
            >
              {previewStatus ? Icons().markdownFill : Icons().markdown}
            </button>
          </Floater>
          {AV.User.current() ? (
            <Floater
              offset={5}
              eventDelay={0}
              placement="top"
              event="hover"
              content={Translation.adminLogout}
            >
              <button
                onClick={() => {
                  AV.User.logOut();
                  window.location.reload();
                }}
              >
                {Icons().logout}
              </button>
            </Floater>
          ) : (
            ''
          )}
        </div>
        <div>
          <button
            onClick={() => {
              sendComment();
            }}
          >
            {Translation.submit}
          </button>
        </div>
      </div>
      {/* Modals */}
      {modalStatus ? (
        <VerificationModal
          config={NexmentConfigs}
          visibilityFunction={setModalStatus}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default CommentsArea;
