import useComments, {
  commentsItemType,
} from '../../lib/database/getCommentsList';
import React from 'react';
import Modal from '../modal';

const CommentsList = (Props: { type: string; pageKey: string }) => {
  // Reusable data list
  let { commentsData, isLoading, isError } = useComments(Props.pageKey);
  // Modal states
  const [modalVisibility, setModalVisibility] = React.useState<boolean>(false);
  const [modalReplyTo, setModalReplyTo] = React.useState<string>('');
  const [modalContent, setModalContent] = React.useState<commentsItemType[]>(
    []
  );

  /**
   * Modal toggling function
   *
   * @param {commentsItemType[]} replies
   * @param {string} replyTo
   */
  const toggleModal = (replies: commentsItemType[], replyTo: string) => {
    setModalContent(replies);
    setModalReplyTo(replyTo);
    setModalVisibility(true);
  };

  if (isLoading) {
    return <div>Loading....</div>;
  } else if (isError) {
    return <div>Error.</div>;
  } else {
    return (
      <div>
        <ul>
          {commentsData !== undefined && commentsData.length ? (
            commentsData.map(item => (
              <li key={item.ID}>
                <div>
                  <h5>{item.name}</h5>
                  <p>{item.content}</p>
                </div>
                <div>
                  <ul>
                    {item.replyList.map(replyItem => (
                      <li key={replyItem.ID}>
                        <div>
                          <h5>{replyItem.name}</h5>
                          <p>
                            @{item.name}: {replyItem.content}
                            {replyItem.replyList.length ? (
                              <button
                                onClick={() => {
                                  toggleModal(
                                    replyItem.replyList,
                                    replyItem.name
                                  );
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
                    ))}
                  </ul>
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
          <Modal
            type="repliesList"
            content={modalContent}
            replyTo={modalReplyTo}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
};

export default CommentsList;
