import React from 'react';
import RepliesList from '../sections/RepliesList';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import '../../assets/style/modal.scss';
import { nexmentConfigType } from 'components/container';

/**
 * Modal component
 * comments higher than level 2 will be displayed in modals
 * @param {{ type: string; content: commentsItemType[]; replyTo?: string }} Props
 * @returns
 */
const Modal = (Props: {
  type: string;
  content?: any;
  replyTo?: string;
  pageKey?: string;
  replyToID?: number;
  replyToOID?: string;
  visibilityFunction?: Function;
  replyItem?: any;
  config: nexmentConfigType;
}) => {
  // Modal state
  const [repliesModalStatus, setRepliesModalStatus] = React.useState<boolean>(
    true
  );
  // Modal closing event handler
  const handleClose = () => {
    setRepliesModalStatus(!repliesModalStatus);
    if (Props.visibilityFunction) {
      // Change visibility state in CommentsList
      Props.visibilityFunction(Props.replyToOID);
    }
  };
  return (
    <Rodal
      visible={repliesModalStatus}
      onClose={() => {
        handleClose();
      }}
      animation="fade"
      className="nexment-modal-replies"
    >
      <div className="nexment-modal-text">
        <h1>Replies</h1>
      </div>
      <RepliesList
        dataContent={Props.content}
        replyTo={Props.replyTo}
        pageKey={Props.pageKey ? Props.pageKey : ''}
        replyToID={Props.replyToID}
        replyToOID={Props.replyToOID}
        replyItem={Props.replyItem}
        config={Props.config}
      />
    </Rodal>
  );
};

export default Modal;
