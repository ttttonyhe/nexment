import React from 'react';
import { commentsItemType } from 'lib/database/getCommentsList';
import '../../assets/style/modal.scss';

const RepliesList = (Props: {
  dataContent: commentsItemType[];
  replyTo?: string;
}) => {
  // Modal visibility
  const [modalVisibility, setModalVisibility] = React.useState<boolean>(false);
  const [modalReplyTo, setModalReplyTo] = React.useState<string>('');
  const [modalContent, setModalContent] = React.useState<commentsItemType[]>(
    []
  );

  const toggleModal = (replies: commentsItemType[], replyTo: string) => {
    setModalContent(replies);
    setModalReplyTo(replyTo);
    setModalVisibility(true);
  };
  return (
    <div className="nexment-modal">
      <ul>
        {Props.dataContent !== undefined && Props.dataContent.length ? (
          Props.dataContent.map(item => (
            <li key={item.ID}>
              <div>
                <h5>{item.name}</h5>
                <p>
                  @{Props.replyTo}: {item.content}
                  {item.replyList.length ? (
                    <button
                      onClick={() => {
                        toggleModal(item.replyList,item.name);
                      }}
                    >
                      view
                    </button>
                  ) : (
                    ''
                  )}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li>
            <p>No Comments</p>
          </li>
        )}
      </ul>

      {modalVisibility ? (
        <RepliesList replyTo={modalReplyTo} dataContent={modalContent} />
      ) : (
        ''
      )}
    </div>
  );
};
export default RepliesList;
