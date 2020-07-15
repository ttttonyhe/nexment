/**
 * Nexment Container
 * basic structure of a comment instance
 */

import React from 'react';
import '../../assets/style/container.scss';
import getIdentifier from '../../lib/utils/getIdentifier';
import generateCommentID from '../../lib/utils/generateCommentID';
import getCommentsList from '../../lib/database/getCommentsList';

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
      <button
        onClick={async () => {
          console.log(await getCommentsList('/fuck'));
        }}
      >
        Get Data
      </button>
      <section className="nm-comment-list">
        <ul>
          <li>
            <div className="nm-comment-item">
              <div className="nm-comment-item-left">
                <img src="" alt="" />
              </div>
              <div className="nm-comment-item-right">
                <div>
                  <h2>Name</h2>
                  <em>Date</em>
                </div>
                <p>Content</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default NexmentContainer;
