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
  content: any;
  replyTo?: string;
  pageKey: string;
  replyToID?: number;
  replyToOID?: string;
  visibilityFunction?: Function;
  replyItem?:any;
}) => {
  switch (Props.type) {
    case 'repliesList':
      // Modal state
      const [repliesModalStatus, setRepliesModalStatus] = React.useState<
        boolean
      >(true);
      // Modal closing event handler
      const handleClose = () => {
        setRepliesModalStatus(false);
        if (Props.visibilityFunction) {
          // Change visibility state in CommentsList
          Props.visibilityFunction(Props.replyToOID);
        }
      };
      return (
        <div>
          <Rodal
            visible={repliesModalStatus}
            onClose={() => {
              handleClose();
            }}
            showCloseButton={true}
            animation="fade"
          >
            <RepliesList
              dataContent={Props.content}
              replyTo={Props.replyTo}
              pageKey={Props.pageKey}
              replyToID={Props.replyToID}
              replyToOID={Props.replyToOID}
              replyItem={Props.replyItem}
            />
          </Rodal>
        </div>
      );
    default:
      return <div>Not a valid Modal</div>;
  }
};

export default Modal;
