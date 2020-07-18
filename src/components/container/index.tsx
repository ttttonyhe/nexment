import React from 'react';
import '../../assets/style/container.scss';
import getIdentifier from '../../lib/utils/getIdentifier';
import generateCommentID from '../../lib/utils/generateCommentID';
import CommentsList from '../../components/sections/CommentsList';

/**
 * Nexment Container
 * basic structure of a comment instance
 * @param {{ config: { pageKey?: string } }} Props
 * @returns
 */
const NexmentContainer = (Props: { config: { pageKey?: string } }) => {
  const pageKey = Props.config.pageKey
    ? Props.config.pageKey
    : getIdentifier().identifierData;
  return (
    <div className="nm-container">
      <button
        onClick={() => {
          console.log(getIdentifier());
        }}
      >
        Get Identifier
      </button>
      <button
        onClick={() => {
          console.log(generateCommentID());
        }}
      >
        Get ID
      </button>
      {/* FIXME: (a ? a : b) code style improvement */}
      <CommentsList type="primary" pageKey={pageKey} />
    </div>
  );
};

export default NexmentContainer;
