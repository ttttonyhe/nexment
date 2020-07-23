import React from 'react';
import '../../assets/style/container.scss';
import getIdentifier from '../../lib/utils/getIdentifier';
import generateCommentID from '../../lib/utils/generateCommentID';
import CommentsList from '../../components/sections/CommentsList';

export interface nexmentConfigType {
  pageKey?: string;
  leancloud: {
    appId: string;
    appKey: string;
    serverURL: string;
  };
  admin: {
    name: string;
    email: string;
  };
}

/**
 * Nexment Container
 * basic structure of a comment instance
 * @param {{ config: { pageKey?: string } }} Props
 * @returns
 */
const NexmentContainer = (Props: { config: nexmentConfigType }) => {
  // Get / Generate PageKey
  const pageKey = Props.config.pageKey
    ? Props.config.pageKey
    : getIdentifier().identifierData;

  // Render structure
  const nexmentContainer = (
    <div className="nexment-container">
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
      <CommentsList type="primary" pageKey={pageKey} config={Props.config} />
    </div>
  );

  return nexmentContainer;
};

export default NexmentContainer;
