import React from 'react';
import RepliesList from '../sections/RepliesList';

/**
 * Modal component
 * comments higher than level 2 will be displayed in modals
 * @param {{ type: string; content: commentsItemType[]; replyTo?: string }} Props
 * @returns
 */
const Modal = (Props: {
  type: string;
  content: any;
  replyTo?: string;
  pageKey: string;
  replyToID?: number;
  replyToOID?: string;
}) => {
  switch (Props.type) {
    case 'repliesList':
      return (
        <div>
          <RepliesList
            dataContent={Props.content}
            replyTo={Props.replyTo}
            pageKey={Props.pageKey}
            replyToID={Props.replyToID}
            replyToOID={Props.replyToOID}
          />
        </div>
      );
    default:
      return <div>Not a valid Modal</div>;
  }
};

export default Modal;
