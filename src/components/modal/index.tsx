import React from 'react';
import RepliesList from '../sections/RepliesList';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import '../../assets/style/modal.scss';

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
  replyToName?: string;
  visibilityFunction?: Function;
  replyItem?: any;
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
      animation="slideUp"
      duration={200}
      className="nexment-modal-replies"
    >
      <RepliesList
        dataContent={Props.content}
        replyTo={Props.replyTo}
        pageKey={Props.pageKey ? Props.pageKey : ''}
        replyToID={Props.replyToID}
        replyToOID={Props.replyToOID}
        replyToName={Props.replyToName}
        replyItem={Props.replyItem}
      />
    </Rodal>
  );
};

export default Modal;
