import React from 'react';
import usingSaveComment from '../../lib/database/saveComment';
import generateCommentID from '../../lib/utils/generateCommentID';
import { refetchData } from '../../lib/database/getCommentsList';
import '../../assets/style/commentarea.scss';
import EmojiCard from '../controls/emojiCard/index';
import { nexmentConfigType } from 'components/container';
import VerificationModal from '../modal/verification';
import leanCloud from '../../lib/database/initiation';
import { reactLocalStorage } from 'reactjs-localstorage';
import TagCard from '../controls/tagCard';

const CommentsArea = (Props: {
  pageKey: string;
  replyTo: number | undefined;
  replyToOID: string | undefined;
  primaryReplyTo: number | undefined;
  primaryReplyToOID: string | undefined;
  random?: number;
  config: nexmentConfigType;
}) => {
  const AV = leanCloud(
    Props.config.leancloud.appId,
    Props.config.leancloud.appKey,
    Props.config.leancloud.serverURL
  );

  // Get initial replyto / replytoOID
  const primaryReplyTo = Props.primaryReplyTo;
  const primaryReplyToOID = Props.primaryReplyToOID;

  // Get commenter info from local storage
  const getCommenterInfo = (type: string) => {
    if (reactLocalStorage.getObject('nexment-commenterInfo')) {
      return reactLocalStorage.getObject('nexment-commenterInfo')[type];
    } else {
      return '';
    }
  };
  // Store commenter info in local storage
  const setCommenterInfo = (info: {
    name: string;
    email: string;
    tag: string;
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
  const [commentContent, setCommentContent] = React.useState<string>('');
  const [commentTag, setCommentTag] = React.useState<string>(
    getCommenterInfo('tag')
  );

  // Temporary comment state for content addons
  const [tempCommentContent, setTempCommentContent] = React.useState<
    string | undefined
  >();

  // Resetting state
  const [resetStatus, setResetStatus] = React.useState<boolean>(false);

  // Modal state
  const [modalStatus, setModalStatus] = React.useState<boolean>(false);

  /**
   * Listen to replyTo / random change
   * random is a random number
   * designed to make reset status false when replying to the previous comment
   */
  React.useEffect(() => {
    setResetStatus(false);
  }, [Props.replyTo, Props.random]);

  // Process data sending from content addons
  const handleAddon = (content: string) => {
    setTempCommentContent(commentContent + content);
    setCommentContent(commentContent + content);
  };

  // Input change handlers
  const handleNameChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentName(e.target.value);
    if (e.target.value === Props.config.admin.name && !AV.User.current()) {
      setModalStatus(true);
    }
  };
  const handleEmailChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentEmail(e.target.value);
    if (e.target.value === Props.config.admin.email && !AV.User.current()) {
      setModalStatus(true);
    }
  };
  const handleContentChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTempCommentContent(undefined);
    setCommentContent(e.target.value);
  };
  const handleTagChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentTag(e.target.value);
  };

  // Comment submitting function
  const sendComment = async () => {
    let replyingTo = resetStatus ? primaryReplyTo : Props.replyTo;
    let replyingToOID = resetStatus ? primaryReplyToOID : Props.replyToOID;
    const returnData = await usingSaveComment(
      {
        ID: generateCommentID().idData,
        identifier: Props.pageKey,
        name: commentName,
        email: commentEmail,
        content: commentContent,
        tag: commentTag,
        reply: replyingTo,
        replyOID: replyingToOID,
      },
      Props.config
    );
    if (returnData.status === 500) {
      alert('Comment sending error');
    } else if (returnData.status === 501) {
      setModalStatus(true);
    } else {
      // Comment success
      // Store commenter info
      setCommenterInfo({
        name: commentName,
        email: commentEmail,
        tag: commentTag,
      });
      // Set content to empty
      setCommentContent('');
      // Refetch data using swr mutate
      refetchData(Props.pageKey);
    }
  };

  // Reset reply to initial
  const resetReplyTo = () => {
    setResetStatus(true);
  };

  return (
    <div>
      <input
        placeholder={commentName ? commentName : "Email"}
        onChange={handleNameChange}
      ></input>
      <input
        placeholder={commentEmail ? commentEmail : "Email"}
        onChange={handleEmailChange}
      ></input>
      <textarea
        placeholder="Enter some text"
        onChange={handleContentChange}
        value={tempCommentContent}
      ></textarea>
      <button
        onClick={() => {
          sendComment();
        }}
      >
        Send
      </button>
      <button onClick={resetReplyTo}>reset reply</button>
      <EmojiCard handler={handleAddon} />
      <button
        onClick={() => {
          AV.User.logOut();
          window.location.reload();
        }}
      >
        logout
      </button>
      <TagCard tag={commentTag} handler={handleTagChange}></TagCard>
      <div>
        <h5>
          {commentName}({commentEmail})
        </h5>
        <p>Content: {commentContent}</p>
        <p>Replying to: {resetStatus ? primaryReplyTo : Props.replyTo}</p>
        <p>
          Replying to OID:
          {resetStatus ? primaryReplyToOID : Props.replyToOID}
        </p>
        <p>Tag: {commentTag}</p>
      </div>
      {/* Modals */}
      {modalStatus ? (
        <VerificationModal
          config={Props.config}
          visibilityFunction={setModalStatus}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default CommentsArea;
