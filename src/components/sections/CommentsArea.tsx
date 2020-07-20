import React from 'react';
import usingSaveComment from '../../lib/database/saveComment';
import generateCommentID from '../../lib/utils/generateCommentID';
import { refetchData } from '../../lib/database/getCommentsList';
import '../../assets/style/commentarea.scss';
import EmojiCard from '../controls/emojiCard/index';

const CommentsArea = (Props: {
  pageKey: string;
  replyTo: number | undefined;
  replyToOID: string | undefined;
  primaryReplyTo: number | undefined;
  primaryReplyToOID: string | undefined;
  random?: number;
}) => {
  // Get initial replyto / replytoOID
  const primaryReplyTo = Props.primaryReplyTo;
  const primaryReplyToOID = Props.primaryReplyToOID;

  // Current comment states
  const [commentName, setCommentName] = React.useState<string>('');
  const [commentEmail, setCommentEmail] = React.useState<string>('');
  const [commentContent, setCommentContent] = React.useState<string>('');

  // Temporary comment state for content addons
  const [tempCommentContent, setTempCommentContent] = React.useState<
    string | undefined
  >();

  // Resetting state
  const [resetStatus, setResetStatus] = React.useState<boolean>(false);

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
  };
  const handleEmailChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentEmail(e.target.value);
  };
  const handleContentChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTempCommentContent(undefined);
    setCommentContent(e.target.value);
  };

  // Comment submitting function
  const sendComment = async () => {
    let replyingTo = resetStatus ? primaryReplyTo : Props.replyTo;
    let replyingToOID = resetStatus ? primaryReplyToOID : Props.replyToOID;
    await usingSaveComment({
      ID: generateCommentID().idData,
      identifier: Props.pageKey,
      name: commentName,
      email: commentEmail,
      content: commentContent,
      reply: replyingTo,
      replyOID: replyingToOID,
    });
    // Refetch data using swr mutate
    refetchData(Props.pageKey);
  };

  // Reset reply to initial
  const resetReplyTo = () => {
    setResetStatus(true);
  };

  return (
    <div>
      <input placeholder="name" onChange={handleNameChange}></input>
      <input placeholder="email" onChange={handleEmailChange}></input>
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
      </div>
    </div>
  );
};

export default CommentsArea;
