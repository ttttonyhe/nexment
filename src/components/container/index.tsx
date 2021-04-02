import React from 'react';
import '../../assets/style/container.scss';
import getIdentifier from '../../lib/utils/getIdentifier';
import CommentsList from '../../components/sections/CommentsList';
import { Provider } from '../../lib/utils/configContext';

// Nexment Configuration Interface
export interface nexmentConfigType {
  pageKey?: string;
  enableLinkInput?: boolean;
  enableReplyListModal?: boolean;
  descriptionTag?: boolean;
  leancloud: {
    appId: string;
    appKey: string;
    serverURL: string;
  };
  admin: {
    name: string;
    email: string;
  };
  blackList?: {
    name?: string;
    email?: string;
    link?: string;
    keyword?: string;
  }[];
}

/**
 * Nexment Container
 * basic structure of a nexment instance
 *
 * @param {{ config: nexmentConfigType }} Props
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
      <Provider value={Props.config}>
        <CommentsList type="primary" pageKey={pageKey} />
      </Provider>
    </div>
  );

  return nexmentContainer;
};

export default NexmentContainer;
