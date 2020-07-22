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

  // Admin password verification
  /*
  if (Props.config.admin.pwd.length < 8) {
    return (
      <div className="nexment-container-error">
        <h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
              fill="rgba(238,56,46,1)"
            />
          </svg>
          Initiation Error
        </h2>
        <p>
          <span>Nexment</span>admin password string length should be longer than
          8
        </p>
      </div>
    );
  }
  */

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
