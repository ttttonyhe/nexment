/**
 * Nexment Container
 * basic structure of a comment instance
 */

import React from 'react';
import '../../assets/style/container.scss';
import getIdentifier from '../../lib/utils/getIdentifier';
import generateCommentID from '../../lib/utils/generateCommentID';
import CommentsList from '../../components/sections/CommentsList';

const NexmentContainer = () => {
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
      <CommentsList pageKey={getIdentifier().identifierData} />
    </div>
  );
};

export default NexmentContainer;
